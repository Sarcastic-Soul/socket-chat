import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";

const useGetMessages = () => {
	const { selectedConversation, messageCache, setMessageCache } = useConversation();
	const [loading, setLoading] = useState(false);
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		const getMessages = async () => {
			if (!selectedConversation) return;

			const cached = messageCache[selectedConversation._id]?.messages;
			if (cached) {
				setMessages(cached);
				return;
			}

			setLoading(true);
			try {
				const res = await fetch(`/api/messages/${selectedConversation._id}`);
				const data = await res.json();
				setMessages(data);
				setMessageCache(selectedConversation._id, data); // ✅ cache it
			} catch (err) {
				console.error(err);
			}
			setLoading(false);
		};

		getMessages();
	}, [selectedConversation, messageCache, setMessageCache]);

	return { messages, loading };
};

export default useGetMessages;
