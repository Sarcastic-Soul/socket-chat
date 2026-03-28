import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import {
    Avatar,
    Text,
    Group,
    Paper,
    ActionIcon,
    Stack,
    Box,
    Popover,
    UnstyledButton,
} from "@mantine/core";
import { FiSmile } from "react-icons/fi";
import { BsCheck, BsCheckAll } from "react-icons/bs";

const Message = ({ message }) => {
    const { authUser } = useAuthContext();
    const { selectedConversation, updateMessage } = useConversation();

    const senderId = message.senderId._id || message.senderId;
    const fromMe = senderId === authUser._id;

    const formattedTime = extractTime(message.createdAt);
    const shakeClass = message.shouldShake ? "shake" : "";

    let profilePic;
    if (fromMe) {
        profilePic = authUser.profilePic;
    } else {
        if (selectedConversation?.isGroupChat) {
            const sender = selectedConversation.participants.find(
                (p) => p._id === senderId,
            );
            profilePic = sender?.profilePic;
        } else {
            profilePic = selectedConversation?.profilePic;
        }
    }

    const [showReactionPicker, setShowReactionPicker] = useState(false);
    const [isReacting, setIsReacting] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [animatingReaction, setAnimatingReaction] = useState(null);

    const hasUserReactedWith = (reactionEmoji) => {
        return message.reactions?.some(
            (r) => r.userId === authUser._id && r.reaction === reactionEmoji,
        );
    };

    const handleReaction = async (reaction) => {
        if (isReacting) return;
        setIsReacting(true);
        setAnimatingReaction(reaction);
        setShowReactionPicker(false);

        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL || ""}/api/messages/react/${message._id}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ reaction }),
                },
            );
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            updateMessage(message._id, { reactions: data.reactions });

            setTimeout(() => setAnimatingReaction(null), 500);
        } catch (error) {
            notifications.show({ message: error.message, color: "red" });
            setAnimatingReaction(null);
        } finally {
            setIsReacting(false);
        }
    };

    const reactionCounts =
        message.reactions?.reduce((acc, r) => {
            acc[r.reaction] = (acc[r.reaction] || 0) + 1;
            return acc;
        }, {}) || {};

    const availableReactions = ["👍", "❤️", "😂", "😮", "😢", "😡"];

    return (
        <Group
            align="flex-end"
            justify={fromMe ? "flex-end" : "flex-start"}
            gap="sm"
            mb="md"
            className={shakeClass}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            wrap="nowrap"
        >
            {!fromMe && <Avatar src={profilePic} radius="xl" size="md" />}

            <Stack
                gap={2}
                align={fromMe ? "flex-end" : "flex-start"}
                style={{ maxWidth: "70%" }}
            >
                <Group
                    gap="xs"
                    align="center"
                    style={{ flexDirection: fromMe ? "row-reverse" : "row" }}
                >
                    <Paper
                        p="sm"
                        radius="lg"
                        bg={
                            fromMe
                                ? "var(--mantine-primary-color-filled)"
                                : "var(--mantine-color-default)"
                        }
                        c={fromMe ? "white" : "var(--mantine-color-text)"}
                        withBorder={!fromMe}
                        style={{
                            borderBottomRightRadius: fromMe ? 4 : undefined,
                            borderBottomLeftRadius: !fromMe ? 4 : undefined,
                        }}
                    >
                        {message.mediaUrl && (
                            <Box mb={message.message ? "sm" : 0}>
                                {message.mediaType === "image" ? (
                                    <img
                                        src={message.mediaUrl}
                                        alt="media"
                                        style={{
                                            maxWidth: "100%",
                                            borderRadius: 8,
                                            maxHeight: 250,
                                            objectFit: "cover",
                                        }}
                                    />
                                ) : (
                                    <video
                                        src={message.mediaUrl}
                                        controls
                                        style={{
                                            maxWidth: "100%",
                                            borderRadius: 8,
                                            maxHeight: 250,
                                        }}
                                    />
                                )}
                            </Box>
                        )}
                        {message.message && (
                            <Text size="sm" style={{ wordBreak: "break-word" }}>
                                {message.message}
                            </Text>
                        )}
                    </Paper>

                    {isHovered && (
                        <Popover
                            opened={showReactionPicker}
                            onChange={setShowReactionPicker}
                            position={fromMe ? "left" : "right"}
                            withArrow
                            shadow="md"
                        >
                            <Popover.Target>
                                <ActionIcon
                                    variant="subtle"
                                    radius="xl"
                                    onClick={() =>
                                        setShowReactionPicker((o) => !o)
                                    }
                                >
                                    <FiSmile size={16} />
                                </ActionIcon>
                            </Popover.Target>
                            <Popover.Dropdown p="xs">
                                <Group gap={4}>
                                    {availableReactions.map((emoji) => (
                                        <ActionIcon
                                            key={emoji}
                                            variant="subtle"
                                            onClick={() =>
                                                handleReaction(emoji)
                                            }
                                            size="lg"
                                        >
                                            <Text size="xl">{emoji}</Text>
                                        </ActionIcon>
                                    ))}
                                </Group>
                            </Popover.Dropdown>
                        </Popover>
                    )}
                </Group>

                {Object.keys(reactionCounts).length > 0 && (
                    <Group
                        gap="xs"
                        mt={-8}
                        style={{
                            zIndex: 1,
                            flexDirection: fromMe ? "row-reverse" : "row",
                        }}
                    >
                        {Object.entries(reactionCounts).map(
                            ([reaction, count]) => (
                                <UnstyledButton
                                    key={reaction}
                                    onClick={() => handleReaction(reaction)}
                                    className={
                                        animatingReaction === reaction
                                            ? "animate-bounce-reaction"
                                            : ""
                                    }
                                    style={(theme) => ({
                                        backgroundColor: hasUserReactedWith(
                                            reaction,
                                        )
                                            ? "var(--mantine-primary-color-light)"
                                            : "var(--mantine-color-default)",
                                        border: `1px solid ${hasUserReactedWith(reaction) ? "var(--mantine-primary-color-outline)" : "var(--mantine-color-default-border)"}`,
                                        borderRadius: theme.radius.xl,
                                        padding: "2px 8px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 4,
                                        fontSize: 12,
                                        fontWeight: 600,
                                    })}
                                >
                                    <span>{reaction}</span>
                                    <span>{count}</span>
                                </UnstyledButton>
                            ),
                        )}
                    </Group>
                )}

                <Group gap={4} align="center">
                    <Text size="xs" c="dimmed">
                        {formattedTime}
                    </Text>
                    {fromMe &&
                        (message.status === "read" ? (
                            <BsCheckAll
                                size={14}
                                style={{ color: "var(--mantine-color-blue-5)" }}
                            />
                        ) : (
                            <BsCheck
                                size={14}
                                style={{ color: "var(--mantine-color-dimmed)" }}
                            />
                        ))}
                </Group>
            </Stack>

            {fromMe && <Avatar src={profilePic} radius="xl" size="md" />}
        </Group>
    );
};

export default Message;
