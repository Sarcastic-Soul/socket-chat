import { useRef, useCallback, useEffect } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import Message from "./Message";
import useListenMessages from "../../hooks/useListenMessages";
import {
    ScrollArea,
    Center,
    Loader,
    Text,
    Stack,
    Group,
    Avatar,
    Paper,
} from "@mantine/core";
import useConversation from "../../zustand/useConversation";

const Messages = ({ searchQuery }) => {
    const { messages, loading, loadOlderMessages, hasMore, isLoadingMore } =
        useGetMessages();
    useListenMessages();
    const observer = useRef();
    const lastMessageRef = useRef();
    const viewportRef = useRef();
    const { typingUsers, selectedConversation } = useConversation();

    const filteredMessages =
        messages?.filter((message) => {
            if (!searchQuery) return true;
            return message.message
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase());
        }) || [];

    const topRef = useCallback(
        (node) => {
            if (isLoadingMore) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
                    loadOlderMessages();
                }
            });
            if (node) observer.current.observe(node);
        },
        [isLoadingMore, hasMore, loadOlderMessages],
    );

    useEffect(() => {
        if (messages.length > 0 && lastMessageRef.current) {
            setTimeout(() => {
                lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        }
    }, [messages.length, typingUsers.length]);

    return (
        <ScrollArea
            viewportRef={viewportRef}
            style={{ flex: 1 }}
            p="md"
            offsetScrollbars
        >
            {isLoadingMore && (
                <Center py="xs">
                    <Loader size="sm" type="dots" />
                    <Text size="sm" c="dimmed" ml="xs">
                        Loading more messages...
                    </Text>
                </Center>
            )}

            {hasMore && messages.length > 0 && (
                <div ref={topRef} style={{ height: "1px" }} />
            )}

            {loading && messages.length === 0 && (
                <Stack>
                    {[...Array(5)].map((_, idx) => (
                        <MessageSkeleton key={idx} />
                    ))}
                </Stack>
            )}

            {filteredMessages.length > 0 &&
                filteredMessages.map((message, idx) => {
                    const isLastMessage =
                        idx === filteredMessages.length - 1 &&
                        typingUsers.length === 0;
                    return (
                        <div
                            key={message._id}
                            ref={isLastMessage ? lastMessageRef : null}
                        >
                            <Message message={message} />
                        </div>
                    );
                })}

            {!loading &&
                messages?.length > 0 &&
                filteredMessages.length === 0 && (
                    <Center h="100%">
                        <Text c="dimmed">
                            No messages found matching "{searchQuery}".
                        </Text>
                    </Center>
                )}

            {!loading &&
                messages &&
                Array.isArray(messages) &&
                messages.length === 0 && (
                    <Center h="100%">
                        <Text c="dimmed">
                            Send a message to start the conversation.
                        </Text>
                    </Center>
                )}

            {typingUsers.length > 0 && (
                <Stack gap="xs" mt="sm" ref={lastMessageRef}>
                    {typingUsers.map((typingUserId) => {
                        let profilePic = "/default-avatar.png";

                        if (selectedConversation?.isGroupChat) {
                            const participant =
                                selectedConversation.participants?.find(
                                    (p) => p._id === typingUserId,
                                );
                            if (participant)
                                profilePic = participant.profilePic;
                        } else {
                            profilePic =
                                selectedConversation?.profilePic || profilePic;
                        }

                        return (
                            <Group
                                key={typingUserId}
                                gap="sm"
                                align="flex-end"
                                wrap="nowrap"
                            >
                                <Avatar
                                    src={profilePic}
                                    radius="xl"
                                    size="md"
                                />
                                <Paper
                                    p="sm"
                                    radius="lg"
                                    bg="light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-6))"
                                    style={{
                                        borderBottomLeftRadius: 4,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        height: 38,
                                    }}
                                >
                                    <Loader
                                        size="xs"
                                        type="dots"
                                        color="gray"
                                    />
                                </Paper>
                            </Group>
                        );
                    })}
                </Stack>
            )}
        </ScrollArea>
    );
};

export default Messages;
