import { FiSend, FiSmile, FiPaperclip, FiMic, FiSquare } from "react-icons/fi";
import EmojiPicker from "emoji-picker-react";
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
import useMessageInput from "../../hooks/useMessageInput";

const MessageInput = () => {
    const { colorScheme } = useMantineColorScheme();
    const {
        message,
        setMessage,
        showEmojiPicker,
        setShowEmojiPicker,
        file,
        previewUrl,
        isUploading,
        loading,
        resetRef,
        messages,
        replyingToMessage,
        setReplyingToMessage,
        selectedConversation,
        authUser,
        isGenerating,
        selectedTone,
        setSelectedTone,
        isRecording,
        inputRef,
        handleMagicReply,
        handleFileChange,
        startRecording,
        stopRecording,
        clearFile,
        handleTyping,
        handleSubmit,
    } = useMessageInput();

    const tones = [
        { label: "Auto", value: "Auto" },
        { label: "Pro", value: "Professional" },
        { label: "Casual", value: "Casual" },
        { label: "Funny", value: "Funny" },
    ];

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
