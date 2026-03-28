import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
    const { socket } = useSocketContext();
    const {
        addMessage,
        updateMessage,
        selectedConversation,
        markMessagesRead,
        setUnreadMessage,
    } = useConversation();

    useEffect(() => {
        const handleNewMessage = (newMessage) => {
            // Only add message if it's for the currently selected conversation
            if (
                selectedConversation &&
                (newMessage.senderId === selectedConversation._id ||
                    newMessage.receiverId === selectedConversation._id)
            ) {
                newMessage.shouldShake = true;
                const sound = new Audio(notificationSound);
                sound.play();

                addMessage(newMessage);
            } else {
                setUnreadMessage(newMessage.receiverId);
                const sound = new Audio(notificationSound);
                sound.play();
            }
        };

        const handleMessageReaction = (updatedMessage) => {
            // Only update message if it's for the currently selected conversation
            if (
                selectedConversation &&
                (updatedMessage.senderId === selectedConversation._id ||
                    updatedMessage.receiverId === selectedConversation._id)
            ) {
                updateMessage(updatedMessage);
            }
        };

        const handleMessagesRead = ({ conversationId, userId }) => {
            if (
                selectedConversation &&
                selectedConversation._id === conversationId
            ) {
                markMessagesRead(userId);
            }
        };

        if (socket) {
            socket.on("newMessage", handleNewMessage);
            socket.on("messageReaction", handleMessageReaction);
            socket.on("messagesRead", handleMessagesRead);
        }

        return () => {
            if (socket) {
                socket.off("newMessage", handleNewMessage);
                socket.off("messageReaction", handleMessageReaction);
                socket.off("messagesRead", handleMessagesRead);
            }
        };
    }, [
        socket,
        addMessage,
        updateMessage,
        markMessagesRead,
        setUnreadMessage,
        selectedConversation,
    ]);
};

export default useListenMessages;
