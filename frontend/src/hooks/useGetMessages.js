import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import { getCachedMessages, setCachedMessages, addOlderMessages } from "../utils/messageCacheDB";

const useGetMessages = () => {
    const { selectedConversation } = useConversation();
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const loadInitial = async () => {
            if (!selectedConversation) return;
            setLoading(true);

            const cached = await getCachedMessages(selectedConversation._id);
            if (cached.length > 0) setMessages(cached);

            try {
                const res = await fetch(`/api/messages/${selectedConversation._id}?limit=50`);
                const data = await res.json();
                setMessages(data);
                await setCachedMessages(selectedConversation._id, data);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };
        loadInitial();
    }, [selectedConversation]);

    const loadOlderMessages = async () => {
        if (!selectedConversation || messages.length === 0) return;
        const oldestId = messages[0]._id;

        try {
            const res = await fetch(`/api/messages/${selectedConversation._id}?before=${oldestId}&limit=50`);
            const older = await res.json();

            if (older.length === 0) {
                setHasMore(false);
                toast("No more messages to load.");
                return;
            }

            const combined = [...older, ...messages];
            setMessages(combined);
            await addOlderMessages(selectedConversation._id, older);
        } catch (err) {
            console.error("Error loading older messages:", err);
        }
    };

    return { messages, setMessages, loading, loadOlderMessages, hasMore };
};

export default useGetMessages;
