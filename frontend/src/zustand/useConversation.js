import { create } from "zustand";
import { addMessageToCache, updateMessageInCache } from '../utils/messageCacheDB';

const useConversation = create((set, get) => ({
    selectedConversation: null,
    setSelectedConversation: (conversation) => set({ selectedConversation: conversation }),

    messages: [],
    setMessages: (msgs) => set({ messages: msgs }),

    conversations: [],
    setConversations: (conversations) => set({ conversations }),

    addMessage: (message) => {
        const { selectedConversation } = get();

        set((state) => {
            const messageExists = state.messages.some(msg => msg._id === message._id);
            if (messageExists) {
                return state;
            }
            return { messages: [...state.messages, message] };
        });

        if (selectedConversation?._id) {
            addMessageToCache(selectedConversation._id, message);
        }
    },

    updateMessage: (updatedMessage) => {
        const { selectedConversation } = get();

        set((state) => ({
            messages: state.messages.map(msg =>
                msg._id === updatedMessage._id ? updatedMessage : msg
            )
        }));

        if (selectedConversation?._id) {
            updateMessageInCache(selectedConversation._id, updatedMessage);
        }
    },

    removeMessage: (messageId) => {
        set((state) => ({
            messages: state.messages.filter(msg => msg._id !== messageId)
        }));
    },
}));

export default useConversation;
