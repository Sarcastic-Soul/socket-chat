import { create } from "zustand";

const EXPIRY_TIME = 24 * 60 * 60 * 1000;

const useConversation = create((set, get) => ({
	selectedConversation: null,
	setSelectedConversation: (conversation) => set({ selectedConversation: conversation }),

	messages: [],
	setMessages: (msgs) => set({ messages: msgs }),

	messageCache: loadCacheWithExpiry(),
	setMessageCache: (chatId, messages) => {
		const updatedCache = {
			...get().messageCache,
			[chatId]: {
				messages,
				timestamp: Date.now(),
			},
		};

		set({ messageCache: updatedCache });
		localStorage.setItem("messageCache", JSON.stringify(updatedCache));
	},
}));

function loadCacheWithExpiry() {
	try {
		const stored = localStorage.getItem("messageCache");
		if (!stored) return {};

		const parsed = JSON.parse(stored);
		const now = Date.now();

		const validCache = {};
		for (const chatId in parsed) {
			const { messages, timestamp } = parsed[chatId];
			if (now - timestamp < EXPIRY_TIME) {
				validCache[chatId] = { messages, timestamp };
			}
		}

		return validCache;
	} catch {
		return {};
	}
}

export default useConversation;
