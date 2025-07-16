// hooks/useSendMessage.js

import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useSendMessage = () => {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedConversation } = useConversation();

    // Modify sendMessage to accept mediaUrl and mediaType
    const sendMessage = async (messageText = "", media = null) => {
        setLoading(true);
        try {
            const body = {
                message: messageText,
            };

            if (media && media.url && media.type) {
                body.mediaUrl = media.url;
                body.mediaType = media.type;
            }

            const res = await fetch(`/api/messages/send/${selectedConversation._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }

            setMessages([...messages, data]);
        } catch (error) {
            console.error("Error sending message:", error.message);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { sendMessage, loading };
};

export default useSendMessage;
