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
} from "@mantine/core";

const MessageInput = () => {
    const [message, setMessage] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const { loading, sendMessage } = useSendMessage();
    const { colorScheme } = useMantineColorScheme();
    const resetRef = useRef(null);

    const handleFileChange = (selectedFile) => {
        if (!selectedFile) {
            clearFile();
            return;
        }

        // Size validation (optional, e.g., 5MB limit)
        if (selectedFile.size > 5 * 1024 * 1024) {
            notifications.show({ message: "File size must be less than 5MB", color: "red" });
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

        try {
            await sendMessage({ message: message.trim(), file });
            setMessage("");
            clearFile();
            setShowEmojiPicker(false);
        } catch (error) {
            notifications.show({ message: error.message || "Failed to send message", color: "red" });
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
                        disabled={loading}
                        autoComplete="off"
                    />

                    <ActionIcon
                        type="submit"
                        variant="filled"
                        size="lg"
                        radius="xl"
                        loading={loading}
                        disabled={!message.trim() && !file}
                        title="Send"
                    >
                        {!loading && <FiSend size={18} />}
                    </ActionIcon>
                </Group>
            </form>
        </Box>
    );
};

export default MessageInput;
