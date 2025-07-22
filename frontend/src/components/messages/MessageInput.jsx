import { useState, useRef } from "react";
import { BsSend } from "react-icons/bs";
import { BsEmojiSmile } from "react-icons/bs";
import { FaPaperclip, FaTimes } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import useSendMessage from "../../hooks/useSendMessage";
import toast from "react-hot-toast";

const MessageInput = () => {
    const [message, setMessage] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [uploading, setUploading] = useState(false);

    const { loading: isSendingMessage, sendMessage } = useSendMessage();
    const fileInputRef = useRef(null);
    const messageInputRef = useRef(null); // Ref for the text input

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
                toast.error("Only images and videos are allowed.");
                setSelectedFile(null);
                setFilePreview(null);
                return;
            }
            if (file.size > 20 * 1024 * 1024) { // 20 MB limit
                toast.error("File size must be less than 20MB.");
                setSelectedFile(null);
                setFilePreview(null);
                return;
            }

            setSelectedFile(file);
            setFilePreview(URL.createObjectURL(file));
            setMessage("");
        }
    };

    const removeSelectedFile = () => {
        setSelectedFile(null);
        setFilePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleEmojiClick = (emojiObject) => {
        setMessage((prevMessage) => prevMessage + emojiObject.emoji);
        setShowEmojiPicker(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!message.trim() && !selectedFile) {
            toast.error("Please enter a message or select a file.");
            return;
        }

        if (isSendingMessage || uploading) {
            return;
        }

        setUploading(true);
        let mediaData = null;

        try {
            if (selectedFile) {
                const signatureRes = await fetch(`${import.meta.env.VITE_API_URL}/api/cloudinary/signature`);
                if (!signatureRes.ok) {
                    throw new Error(`Failed to get Cloudinary signature: ${signatureRes.statusText}`);
                }
                const { signature, timestamp, cloudName, apiKey, folder } = await signatureRes.json();

                const formData = new FormData();
                formData.append("file", selectedFile);
                formData.append("api_key", apiKey);
                formData.append("signature", signature);
                formData.append("timestamp", timestamp);
                formData.append("folder", folder);

                const resourceType = selectedFile.type.startsWith("image/") ? "image" : "video";
                formData.append("resource_type", resourceType);


                const cloudinaryUploadRes = await fetch(
                    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
                    {
                        method: "POST",
                        body: formData,
                    }
                );

                if (!cloudinaryUploadRes.ok) {
                    throw new Error(`Cloudinary upload failed: ${cloudinaryUploadRes.statusText}`);
                }

                const cloudinaryData = await cloudinaryUploadRes.json();
                mediaData = {
                    url: cloudinaryData.secure_url,
                    type: resourceType,
                };
                toast.success("Media uploaded to Cloudinary!");
            }

            await sendMessage(message.trim(), mediaData);

            setMessage("");
            removeSelectedFile();

            // FIX: Focus the input after sending a message
            messageInputRef.current?.focus();

        } catch (error) {
            console.error("Error sending media/message:", error.message);
            toast.error(error.message || "Failed to send message.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <form className="px-4 my-3" onSubmit={handleSubmit}>
            <div className="w-full relative">
                {filePreview && (
                    <div className="mb-2 p-2 rounded-lg bg-gray-700 relative">
                        {selectedFile.type.startsWith("image/") && (
                            <img src={filePreview} alt="Preview" className="max-h-48 rounded-md object-contain mx-auto" />
                        )}
                        {selectedFile.type.startsWith("video/") && (
                            <video src={filePreview} controls className="max-h-48 rounded-md mx-auto"></video>
                        )}
                        <p className="text-xs text-gray-300 mt-1 truncate">
                            {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                        </p>
                        <button
                            type="button"
                            onClick={removeSelectedFile}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                            title="Remove file"
                        >
                            <FaTimes />
                        </button>
                    </div>
                )}

                <input
                    ref={messageInputRef} // Attach the ref to the input
                    type="text"
                    placeholder={selectedFile ? "Add a caption (optional)" : "Send a message"}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-lg bg-gray-800 border border-gray-600 text-white text-sm pr-20 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={uploading}
                />

                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*,video/*"
                    />
                    <button
                        type="button"
                        className="p-2 text-gray-400 hover:text-white transition"
                        onClick={() => fileInputRef.current.click()}
                        title="Attach media"
                        disabled={uploading}
                    >
                        <FaPaperclip className="w-5 h-5" />
                    </button>
                    <button
                        type="button"
                        className="p-2 text-gray-400 hover:text-white transition"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        disabled={uploading}
                    >
                        <BsEmojiSmile className="w-5 h-5" />
                    </button>
                    <button
                        type="submit"
                        className="p-2 text-gray-400 hover:text-white transition"
                        disabled={isSendingMessage || uploading}
                    >
                        {(isSendingMessage || uploading) ? (
                            <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
                        ) : (
                            <BsSend className="w-5 h-5" />
                        )}
                    </button>
                </div>

                {showEmojiPicker && (
                    <div className="absolute bottom-12 right-0 z-10 shadow-xl">
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </div>
                )}
            </div>
        </form>
    );
};

export default MessageInput;
