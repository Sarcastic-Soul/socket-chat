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
    const { selectedConversation, setSelectedConversation } = useConversation();
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
                onClick={() => setSelectedConversation(conversation)}
            >
                <Group gap="sm">
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

                    <Text size="sm" fw={500}>
                        {displayName}
                    </Text>
                </Group>
            </UnstyledButton>

            {!lastIdx && <Divider my="xs" />}
        </>
    );
};

export default Conversation;
