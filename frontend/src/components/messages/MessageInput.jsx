import { useState, useRef } from "react";
import { FiSend, FiSmile, FiPaperclip } from "react-icons/fi";
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
} from "@mantine/core";
import useConversation from "../../zustand/useConversation";
import { useAuthContext } from "../../context/AuthContext";

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
    const { authUser } = useAuthContext();
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedTone, setSelectedTone] = useState("Auto");

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

    const clearFile = () => {
        setFile(null);
        setPreviewUrl(null);
        resetRef.current?.();
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
                    type: file.type.startsWith("video/") ? "video" : "image",
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

                    <FileButton
                        onChange={handleFileChange}
                        accept="image/png,image/jpeg,image/gif,video/mp4"
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
                        flex={1}
                        placeholder="Send a message..."
                        value={message}
                        onChange={(e) => setMessage(e.currentTarget.value)}
                        radius="xl"
                        size="md"
                        disabled={loading || isUploading || isGenerating}
                        autoComplete="off"
                    />

                    <ActionIcon
                        type="submit"
                        variant="filled"
                        size="lg"
                        radius="xl"
                        loading={loading || isUploading}
                        disabled={!message.trim() && !file}
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
