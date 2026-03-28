import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";
import {
    UnstyledButton,
    Group,
    Avatar,
    Text,
    Indicator,
    Divider,
} from "@mantine/core";

const Conversation = ({ conversation, lastIdx }) => {
    const {
        selectedConversation,
        setSelectedConversation,
        unreadMessages,
        clearUnreadMessage,
    } = useConversation();
    const { onlineUsers } = useSocketContext();

    const isSelected = selectedConversation?._id === conversation._id;
    const isOnline =
        !conversation.isGroupChat &&
        conversation.isPublic !== false &&
        onlineUsers.includes(conversation.participantId);

    const displayName = conversation.isGroupChat
        ? conversation.groupName
        : conversation.fullName;
    const displayPic = conversation.profilePic;

    const hasUnread =
        unreadMessages[conversation._id] ||
        (conversation.participantId &&
            unreadMessages[conversation.participantId]);

    const handleSelect = () => {
        setSelectedConversation(conversation);
        clearUnreadMessage(conversation._id);
        if (conversation.participantId) {
            clearUnreadMessage(conversation.participantId);
        }
    };

    return (
        <>
            <UnstyledButton
                w="100%"
                p="sm"
                style={(theme) => ({
                    borderRadius: theme.radius.md,
                    backgroundColor: isSelected
                        ? "var(--mantine-primary-color-light)"
                        : "transparent",
                    "&:hover": {
                        backgroundColor: isSelected
                            ? "var(--mantine-primary-color-light)"
                            : "var(--mantine-color-default-hover)",
                    },
                })}
                onClick={handleSelect}
            >
                <Group gap="sm" wrap="nowrap">
                    <Indicator
                        inline
                        size={12}
                        offset={5}
                        position="bottom-end"
                        color="green"
                        withBorder
                        disabled={!isOnline}
                    >
                        <Avatar src={displayPic} radius="xl" size="md" />
                    </Indicator>

                    <Text
                        size="sm"
                        fw={500}
                        style={{
                            flex: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {displayName}
                    </Text>

                    {hasUnread && (
                        <div
                            style={{
                                width: 10,
                                height: 10,
                                borderRadius: "50%",
                                backgroundColor:
                                    "var(--mantine-color-blue-filled)",
                                flexShrink: 0,
                            }}
                        />
                    )}
                </Group>
            </UnstyledButton>

            {!lastIdx && <Divider my="xs" />}
        </>
    );
};

export default Conversation;
