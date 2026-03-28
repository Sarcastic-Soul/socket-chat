import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { FiMessageSquare, FiUsers } from "react-icons/fi";
import { useAuthContext } from "../../context/AuthContext";
import { useSocketContext } from "../../context/SocketContext";
import {
    Flex,
    Group,
    Avatar,
    Text,
    ActionIcon,
    Center,
    Stack,
} from "@mantine/core";

const MessageContainer = () => {
    const { selectedConversation, setSelectedConversation } = useConversation();
    const { onlineUsers } = useSocketContext();
    const navigate = useNavigate();

    useEffect(() => {
        return () => setSelectedConversation(null);
    }, [setSelectedConversation]);

    const isOnline =
        selectedConversation && !selectedConversation.isGroupChat
            ? onlineUsers.includes(selectedConversation.participantId)
            : false;

    const displayName = selectedConversation?.isGroupChat
        ? selectedConversation.groupName
        : selectedConversation?.fullName;

    const displayPic =
        selectedConversation?.profilePic || "/default-avatar.png";

    const handleHeaderClick = () => {
        if (selectedConversation?.isGroupChat) {
            navigate(`/group/${selectedConversation._id}`);
        } else if (selectedConversation) {
            navigate(`/user/${selectedConversation.participantId}`);
        }
    };

    return (
        <Flex direction="column" h="100%">
            {!selectedConversation ? (
                <NoChatSelected />
            ) : (
                <>
                    <Group
                        justify="space-between"
                        p="md"
                        style={{
                            borderBottom:
                                "1px solid var(--mantine-color-default-border)",
                        }}
                    >
                        <Group
                            onClick={handleHeaderClick}
                            style={{ cursor: "pointer" }}
                        >
                            <Avatar src={displayPic} radius="xl" size="md" />
                            <Stack gap={0}>
                                <Text fw={600} size="md">
                                    {displayName}
                                </Text>
                                {!selectedConversation.isGroupChat && (
                                    <Text
                                        size="xs"
                                        c={isOnline ? "green" : "dimmed"}
                                    >
                                        {isOnline ? "Online" : "Offline"}
                                    </Text>
                                )}
                            </Stack>
                        </Group>
                        {selectedConversation.isGroupChat && (
                            <ActionIcon
                                variant="subtle"
                                radius="xl"
                                size="lg"
                                onClick={handleHeaderClick}
                            >
                                <FiUsers size={18} />
                            </ActionIcon>
                        )}
                    </Group>

                    <Messages />
                    <MessageInput />
                </>
            )}
        </Flex>
    );
};

export default MessageContainer;

const NoChatSelected = () => {
    const { authUser } = useAuthContext();
    return (
        <Center h="100%" w="100%">
            <Stack align="center" gap="sm">
                <Text size="xl" fw={600} ta="center">
                    Welcome 👋 {authUser.fullName}
                </Text>
                <Text size="lg" ta="center" c="dimmed">
                    Select a chat to start messaging
                </Text>
                <FiMessageSquare
                    size={60}
                    style={{ color: "var(--mantine-color-dimmed)" }}
                />
            </Stack>
        </Center>
    );
};
