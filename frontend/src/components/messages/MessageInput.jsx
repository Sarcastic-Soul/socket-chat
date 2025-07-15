import { useState } from "react";
import { BsSend } from "react-icons/bs";
import { BsEmojiSmile } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import useSendMessage from "../../hooks/useSendMessage";

const MessageInput = () => {
    const [message, setMessage] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const { loading, sendMessage } = useSendMessage();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message) return;
        await sendMessage(message);
        setMessage("");
    };

    const handleEmojiClick = (emojiObject) => {
        setMessage((prevMessage) => prevMessage + emojiObject.emoji);
        setShowEmojiPicker(false);
    };

    return (
        <form className="px-4 my-3" onSubmit={handleSubmit}>
            <div className="w-full relative">
                <input
                    type="text"
                    placeholder="Send a message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-lg bg-gray-800 border border-gray-600 text-white text-sm pr-20 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Right-side icons */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button
                        type="button"
                        className="p-2 text-gray-400 hover:text-white transition"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                        <BsEmojiSmile className="w-5 h-5" />
                    </button>
                    <button
                        type="submit"
                        className="p-2 text-gray-400 hover:text-white transition"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
                        ) : (
                            <BsSend className="w-5 h-5" />
                        )}
                    </button>
                </div>

                {/* Emoji Picker */}
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
