import { create } from "zustand";
import { addMessageToCache, updateMessageInCache } from '../utils/messageCacheDB';

const useConversation = create((set, get) => ({
    selectedConversation: null,
    setSelectedConversation: (conversation) => set({ selectedConversation: conversation }),

    messages: [],
    setMessages: (msgs) => set({ messages: msgs }),

    addMessage: (message) => {
        const { selectedConversation } = get();

        // Add to in-memory state for immediate UI update
        set((state) => {
            // Prevent adding duplicate messages to the in-memory state
            const messageExists = state.messages.some(msg => msg._id === message._id);
            if (messageExists) {
                return state;
            }
            return { messages: [...state.messages, message] };
        });

        // Add to IndexedDB for persistence
        if (selectedConversation?._id) {
            addMessageToCache(selectedConversation._id, message);
        }
    },

    // Update a specific message (for reactions, edits, etc.)
    updateMessage: (updatedMessage) => {
        const { selectedConversation } = get();

        // Update in-memory state
        set((state) => ({
            messages: state.messages.map(msg =>
                msg._id === updatedMessage._id ? updatedMessage : msg
            )
        }));

        // Update in cache
        if (selectedConversation?._id) {
            updateMessageInCache(selectedConversation._id, updatedMessage);
        }
    },

    // Remove a message
    removeMessage: (messageId) => {
        set((state) => ({
            messages: state.messages.filter(msg => msg._id !== messageId)
        }));
    },
}));

export default useConversation;
