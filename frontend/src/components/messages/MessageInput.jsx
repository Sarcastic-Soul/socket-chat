import { useState, useRef, useEffect } from "react";
import { FiSend, FiSmile, FiPaperclip, FiMic, FiSquare } from "react-icons/fi";
import EmojiPicker from "emoji-picker-react";
import useSendMessage from "../../hooks/useSendMessage";
import { notifications } from "@mantine/notifications";
import {
    TextInput,
    ActionIcon,
    Group,
    Box,
    Popover,
    FileButton,
    useMantineColorScheme,
    Image,
    CloseButton,
    Indicator,
    Select,
    Text,
} from "@mantine/core";
import useConversation from "../../zustand/useConversation";
import { useAuthContext } from "../../context/AuthContext";
import { useSocketContext } from "../../context/SocketContext";

const MessageInput = () => {
    const [message, setMessage] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const { loading, sendMessage } = useSendMessage();
    const { colorScheme } = useMantineColorScheme();
    const resetRef = useRef(null);
    const messages = useConversation((state) => state.messages);
    const replyingToMessage = useConversation(
        (state) => state.replyingToMessage,
    );
    const setReplyingToMessage = useConversation(
        (state) => state.setReplyingToMessage,
    );
    const selectedConversation = useConversation(
        (state) => state.selectedConversation,
    );
    const { authUser } = useAuthContext();
    const { socket } = useSocketContext();
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedTone, setSelectedTone] = useState("Auto");
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const inputRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    useEffect(() => {
        if (replyingToMessage && inputRef.current) {
            inputRef.current.focus();
        }
    }, [replyingToMessage]);

    const tones = [
        { label: "Auto", value: "Auto" },
        { label: "Pro", value: "Professional" },
        { label: "Casual", value: "Casual" },
        { label: "Funny", value: "Funny" },
    ];

    const handleMagicReply = async () => {
        if (isGenerating) return;
        setIsGenerating(true);
        const originalMessage = message;
        setMessage("✨ Drafting...");

        try {
            const lastMessages = messages.slice(-5).map((m) => {
                const senderId = m.senderId?._id || m.senderId;
                const isMe = senderId === authUser?._id;

                return {
                    sender: isMe
                        ? "Me"
                        : m.senderId?.username || m.senderId || "Other User",
                    text: m.message,
                };
            });

            const res = await fetch(
                `${import.meta.env.VITE_API_URL || ""}/api/messages/magic-reply`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        messages: lastMessages,
                        requestedTone: selectedTone,
                    }),
                },
            );

            const data = await res.json();
            if (data.reply) {
                setMessage(data.reply);
            } else {
                setMessage(originalMessage);
                notifications.show({
                    message: data.error || "Could not generate reply",
                    color: "red",
                });
            }
        } catch (error) {
            setMessage(originalMessage);
            notifications.show({
                message: error.message || "Failed to generate reply",
                color: "red",
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleFileChange = (selectedFile) => {
        if (!selectedFile) {
            clearFile();
            return;
        }

        // Size validation (optional, e.g., 5MB limit)
        if (selectedFile.size > 5 * 1024 * 1024) {
            notifications.show({
                message: "File size must be less than 5MB",
                color: "red",
            });
            return;
        }

        setFile(selectedFile);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(selectedFile);
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) audioChunksRef.current.push(e.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(audioChunksRef.current, {
                    type: "audio/webm",
                });
                const audioFile = new File([blob], "voice-message.webm", {
                    type: "audio/webm",
                });
                setFile(audioFile);
                setPreviewUrl(URL.createObjectURL(blob));
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (error) {
            notifications.show({
                message: "Microphone access denied",
                color: "red",
            });
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            mediaRecorderRef.current.stream
                .getTracks()
                .forEach((t) => t.stop());
        }
    };

    const clearFile = () => {
        setFile(null);
        setPreviewUrl(null);
        resetRef.current?.();
    };

    const handleTyping = (e) => {
        setMessage(e.currentTarget.value);

        if (!socket || !selectedConversation) return;

        socket.emit("typing", {
            conversationId: selectedConversation._id,
            receiverId: selectedConversation.participantId,
            isGroupChat: selectedConversation.isGroupChat,
        });

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            socket.emit("stopTyping", {
                conversationId: selectedConversation._id,
                receiverId: selectedConversation.participantId,
                isGroupChat: selectedConversation.isGroupChat,
            });
        }, 2000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim() && !file) return;

        let media = null;

        if (file) {
            setIsUploading(true);
            try {
                const sigRes = await fetch(
                    `${import.meta.env.VITE_API_URL || ""}/api/cloudinary/signature`,
                );
                const sigData = await sigRes.json();

                if (sigData.error) throw new Error(sigData.error);

                const formData = new FormData();
                formData.append("file", file);
                formData.append("api_key", sigData.apiKey);
                formData.append("timestamp", sigData.timestamp);
                formData.append("signature", sigData.signature);
                formData.append("folder", sigData.folder);

                const uploadRes = await fetch(
                    `https://api.cloudinary.com/v1_1/${sigData.cloudName}/auto/upload`,
                    {
                        method: "POST",
                        body: formData,
                        credentials: "omit",
                    },
                );

                const uploadData = await uploadRes.json();
                if (uploadData.error) throw new Error(uploadData.error.message);

                media = {
                    url: uploadData.secure_url,
                    type: file.type.startsWith("video/")
                        ? "video"
                        : file.type.startsWith("audio/")
                          ? "audio"
                          : "image",
                };
            } catch (error) {
                notifications.show({
                    message: error.message || "Failed to upload file",
                    color: "red",
                });
                setIsUploading(false);
                return;
            }
            setIsUploading(false);
        }

        try {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
                if (socket && selectedConversation) {
                    socket.emit("stopTyping", {
                        conversationId: selectedConversation._id,
                        receiverId: selectedConversation.participantId,
                        isGroupChat: selectedConversation.isGroupChat,
                    });
                }
            }

            await sendMessage(message.trim(), media);
            setMessage("");
            clearFile();
            setShowEmojiPicker(false);
        } catch (error) {
            notifications.show({
                message: error.message || "Failed to send message",
                color: "red",
            });
        }
    };

    return (
        <Box
            p="md"
            style={{
                borderTop: "1px solid var(--mantine-color-default-border)",
            }}
        >
            {replyingToMessage && (
                <Box
                    mb="sm"
                    p="xs"
                    style={{
                        backgroundColor: "var(--mantine-color-default-hover)",
                        borderRadius: 8,
                        position: "relative",
                        paddingRight: 30,
                    }}
                >
                    <Text size="xs" fw={600} c="dimmed">
                        Replying to{" "}
                        {(() => {
                            const senderObj = replyingToMessage.senderId;
                            const sId = String(senderObj?._id || senderObj);
                            if (sId === String(authUser?._id))
                                return "Yourself";
                            if (senderObj?.fullName) return senderObj.fullName;
                            if (senderObj?.username) return senderObj.username;
                            if (selectedConversation?.isGroupChat) {
                                const p =
                                    selectedConversation.participants?.find(
                                        (p) => String(p._id) === sId,
                                    );
                                return p?.fullName || p?.username || "User";
                            }
                            return selectedConversation?.fullName || "User";
                        })()}
                    </Text>
                    <Text size="sm" lineClamp={1}>
                        {replyingToMessage.message ||
                            (replyingToMessage.mediaUrl
                                ? `[${replyingToMessage.mediaType}]`
                                : "...")}
                    </Text>
                    <CloseButton
                        size="sm"
                        style={{ position: "absolute", top: 8, right: 8 }}
                        onClick={() => setReplyingToMessage(null)}
                    />
                </Box>
            )}

            {previewUrl && (
                <Box
                    mb="sm"
                    style={{ position: "relative", display: "inline-block" }}
                >
                    <Indicator
                        inline
                        size={24}
                        position="top-end"
                        color="red"
                        offset={4}
                        label={
                            <CloseButton
                                size="sm"
                                variant="transparent"
                                c="white"
                                onClick={clearFile}
                            />
                        }
                    >
                        {file.type.startsWith("video/") ? (
                            <video
                                src={previewUrl}
                                style={{ maxHeight: 150, borderRadius: 8 }}
                                controls
                            />
                        ) : file.type.startsWith("audio/") ? (
                            <audio src={previewUrl} controls />
                        ) : (
                            <Image
                                src={previewUrl}
                                style={{
                                    maxHeight: 150,
                                    width: "auto",
                                    borderRadius: 8,
                                }}
                            />
                        )}
                    </Indicator>
                </Box>
            )}

            <form onSubmit={handleSubmit}>
                <Group gap="xs" wrap="nowrap">
                    <Popover
                        opened={showEmojiPicker}
                        onChange={setShowEmojiPicker}
                        position="top-start"
                        withArrow
                        shadow="md"
                    >
                        <Popover.Target>
                            <ActionIcon
                                variant="subtle"
                                size="lg"
                                radius="xl"
                                onClick={() => setShowEmojiPicker((o) => !o)}
                                title="Add emoji"
                            >
                                <FiSmile size={22} />
                            </ActionIcon>
                        </Popover.Target>
                        <Popover.Dropdown p={0}>
                            <EmojiPicker
                                onEmojiClick={(emojiData) =>
                                    setMessage((prev) => prev + emojiData.emoji)
                                }
                                theme={
                                    colorScheme === "dark" ? "dark" : "light"
                                }
                            />
                        </Popover.Dropdown>
                    </Popover>

                    <ActionIcon
                        variant="subtle"
                        size="lg"
                        radius="xl"
                        onClick={handleMagicReply}
                        disabled={isGenerating || messages.length === 0}
                        title="Magic Reply"
                    >
                        ✨
                    </ActionIcon>

                    <Select
                        data={tones}
                        value={selectedTone}
                        onChange={setSelectedTone}
                        size="sm"
                        w={90}
                        disabled={isGenerating}
                        variant="unstyled"
                        styles={{ input: { padding: 0 } }}
                    />

                    <ActionIcon
                        type="button"
                        variant={isRecording ? "filled" : "subtle"}
                        color={isRecording ? "red" : "gray"}
                        size="lg"
                        radius="xl"
                        onClick={isRecording ? stopRecording : startRecording}
                        title={
                            isRecording
                                ? "Stop recording"
                                : "Record voice message"
                        }
                    >
                        {isRecording ? (
                            <FiSquare size={18} />
                        ) : (
                            <FiMic size={18} />
                        )}
                    </ActionIcon>

                    <FileButton
                        onChange={handleFileChange}
                        accept="image/png,image/jpeg,image/gif,video/mp4,audio/*"
                        resetRef={resetRef}
                    >
                        {(props) => (
                            <ActionIcon
                                {...props}
                                variant={file ? "light" : "subtle"}
                                color={file ? undefined : "gray"}
                                size="lg"
                                radius="xl"
                                title="Attach file"
                            >
                                <FiPaperclip size={20} />
                            </ActionIcon>
                        )}
                    </FileButton>

                    <TextInput
                        ref={inputRef}
                        flex={1}
                        placeholder="Send a message..."
                        value={message}
                        onChange={handleTyping}
                        radius="xl"
                        size="md"
                        disabled={
                            loading ||
                            isUploading ||
                            isGenerating ||
                            isRecording
                        }
                        autoComplete="off"
                    />

                    <ActionIcon
                        type="submit"
                        variant="filled"
                        size="lg"
                        radius="xl"
                        loading={loading || isUploading}
                        disabled={(!message.trim() && !file) || isRecording}
                        title="Send"
                    >
                        {!(loading || isUploading) && <FiSend size={18} />}
                    </ActionIcon>
                </Group>
            </form>
        </Box>
    );
};

export default MessageInput;
