import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
	const { socket } = useSocketContext();
	const {
		messages,
		setMessages,
		selectedConversation,
		messageCache,
		setMessageCache,
	} = useConversation();

	useEffect(() => {
		socket?.on("newMessage", (newMessage) => {
			newMessage.shouldShake = true;
			const sound = new Audio(notificationSound);
			sound.play();

			// Update local state
			const updatedMessages = [...messages, newMessage];
			setMessages(updatedMessages);

			// ✅ Update cached messages for this conversation
			if (selectedConversation) {
				setMessageCache(selectedConversation._id, updatedMessages);
			}
		});

		return () => socket?.off("newMessage");
	}, [socket, messages, setMessages, selectedConversation, setMessageCache]);

};

export default useListenMessages;
