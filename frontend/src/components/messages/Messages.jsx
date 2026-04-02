import { useRef, useCallback, useEffect } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import Message from "./Message";
import useListenMessages from "../../hooks/useListenMessages";
import { ScrollArea, Center, Loader, Text, Stack } from "@mantine/core";

const Messages = ({ searchQuery }) => {
    const { messages, loading, loadOlderMessages, hasMore, isLoadingMore } =
        useGetMessages();
    useListenMessages();
    const observer = useRef();
    const lastMessageRef = useRef();
    const viewportRef = useRef();

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
    }, [messages.length]);

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
                    const isLastMessage = idx === filteredMessages.length - 1;
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
        </ScrollArea>
    );
};

export default Messages;
