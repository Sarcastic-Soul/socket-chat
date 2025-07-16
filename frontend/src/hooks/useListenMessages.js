import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
    const { socket } = useSocketContext();
    const { addMessage, updateMessage, selectedConversation } = useConversation();

    useEffect(() => {
        const handleNewMessage = (newMessage) => {
            // Only add message if it's for the currently selected conversation
            if (selectedConversation &&
                (newMessage.senderId === selectedConversation._id ||
                    newMessage.receiverId === selectedConversation._id)) {

                newMessage.shouldShake = true;
                const sound = new Audio(notificationSound);
                sound.play();

                addMessage(newMessage);
            }
        };

        const handleMessageReaction = (updatedMessage) => {
            // Only update message if it's for the currently selected conversation
            if (selectedConversation &&
                (updatedMessage.senderId === selectedConversation._id ||
                    updatedMessage.receiverId === selectedConversation._id)) {

                updateMessage(updatedMessage);
            }
        };

        if (socket) {
            socket.on("newMessage", handleNewMessage);
            socket.on("messageReaction", handleMessageReaction);
        }

        return () => {
            if (socket) {
                socket.off("newMessage", handleNewMessage);
                socket.off("messageReaction", handleMessageReaction);
            }
        };
    }, [socket, addMessage, updateMessage, selectedConversation]);
};

export default useListenMessages;
