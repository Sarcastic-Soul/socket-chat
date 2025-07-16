import { useRef, useCallback, useEffect } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import Message from "./Message";
import useListenMessages from "../../hooks/useListenMessages";

const Messages = () => {
    const { messages, loading, loadOlderMessages, hasMore, isLoadingMore } = useGetMessages();
    useListenMessages();
    const observer = useRef();
    const lastMessageRef = useRef();
    const scrollContainerRef = useRef();

    // Attaches an IntersectionObserver to the top of the message list
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
        [isLoadingMore, hasMore, loadOlderMessages]
    );

    // Auto-scroll to the bottom when new messages arrive
    useEffect(() => {
        if (messages.length > 0 && lastMessageRef.current) {
            setTimeout(() => {
                lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        }
    }, [messages.length]); // Only scroll when message count changes

    return (
        <div className='px-4 flex-1 overflow-auto' ref={scrollContainerRef}>
            {/* Top loading indicator for pagination */}
            {isLoadingMore && (
                <div className="text-center py-2">
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    <span className="ml-2 text-sm text-gray-400">Loading more messages...</span>
                </div>
            )}

            {/* Load more trigger - placed at the top */}
            {hasMore && messages.length > 0 && (
                <div ref={topRef} className="h-1" />
            )}

            {/* Initial loading skeletons */}
            {loading && messages.length === 0 && (
                <div className="space-y-4">
                    {[...Array(5)].map((_, idx) => (
                        <MessageSkeleton key={idx} />
                    ))}
                </div>
            )}

            {/* Messages */}
            {messages && Array.isArray(messages) && messages.length > 0 &&
                messages.map((message, idx) => {
                    const isLastMessage = idx === messages.length - 1;
                    return (
                        <div
                            key={message._id}
                            ref={isLastMessage ? lastMessageRef : null}
                        >
                            <Message message={message} />
                        </div>
                    );
                })
            }

            {/* Empty state */}
            {!loading && messages && Array.isArray(messages) && messages.length === 0 && (
                <div className="flex items-center justify-center h-full">
                    <p className='text-center text-gray-400'>
                        Send a message to start the conversation.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Messages;
