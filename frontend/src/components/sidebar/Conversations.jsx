import useGetConversations from "../../hooks/useGetConversations";
import Conversation from "./Conversation";
import useConversation from "../../zustand/useConversation";
import { ScrollArea, Loader, Center, Text, Stack } from "@mantine/core";

const Conversations = () => {
    const { loading } = useGetConversations();
    const { conversations, searchTerm } = useConversation();

    const filteredConversations = conversations.filter((conv) => {
        const name = conv.isGroupChat ? conv.groupName : conv.fullName;
        return name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <ScrollArea type="auto" offsetScrollbars style={{ flex: 1 }}>
            <Stack gap={0} py="xs">
                {filteredConversations.map((conversation, idx) => (
                    <Conversation
                        key={conversation._id}
                        conversation={conversation}
                        lastIdx={idx === filteredConversations.length - 1}
                    />
                ))}

                {loading && (
                    <Center mt="md">
                        <Loader size="sm" />
                    </Center>
                )}

                {!loading && filteredConversations.length === 0 && (
                    <Text ta="center" c="dimmed" mt="md" size="sm">
                        No conversations found.
                    </Text>
                )}
            </Stack>
        </ScrollArea>
    );
};

export default Conversations;
