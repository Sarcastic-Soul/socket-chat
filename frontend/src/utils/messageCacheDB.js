import { openDB } from 'idb';

const dbPromise = openDB('chat-db', 1, {
    upgrade(db) {
        db.createObjectStore('messages', { keyPath: 'id' }); // id = conversationId
    },
});

/**
 * Retrieves all cached messages for a given conversation.
 */
export const getCachedMessages = async (conversationId) => {
    const db = await dbPromise;
    const entry = await db.get('messages', conversationId);
    return entry?.messages || [];
};

/**
 * Overwrites the cache for a conversation. Use this for the initial fetch.
 */
export const setCachedMessages = async (conversationId, messages) => {
    const db = await dbPromise;
    await db.put('messages', {
        id: conversationId,
        messages,
        timestamp: new Date().getTime(),
    });
};

/**
 * Prepends a chunk of older messages to the cache within a transaction.
 */
export const addOlderMessages = async (conversationId, olderMessages) => {
    const db = await dbPromise;
    const tx = db.transaction('messages', 'readwrite');
    const store = tx.objectStore('messages');
    const entry = await store.get(conversationId);

    // Create a Set of existing message IDs for efficient lookup
    const existingMessageIds = new Set(entry?.messages.map(msg => msg._id));

    // Filter out older messages that already exist
    const uniqueOlderMessages = olderMessages.filter(
        (oldMsg) => !existingMessageIds.has(oldMsg._id)
    );

    const combinedMessages = [...uniqueOlderMessages, ...(entry?.messages || [])];

    await store.put({
        id: conversationId,
        messages: combinedMessages,
        timestamp: new Date().getTime(),
    });

    await tx.done;
};

/**
 * Appends a single new message to the cache within a transaction.
 */
export const addMessageToCache = async (conversationId, newMessage) => {
    const db = await dbPromise;
    const tx = db.transaction('messages', 'readwrite');
    const store = tx.objectStore('messages');
    const entry = await store.get(conversationId);

    // Ensure we don't add duplicate messages
    const messageExists = entry?.messages.some(msg => msg._id === newMessage._id);
    if (messageExists) {
        await tx.done;
        return;
    }

    const combinedMessages = [...(entry?.messages || []), newMessage];

    await store.put({
        id: conversationId,
        messages: combinedMessages,
        timestamp: new Date().getTime(),
    });

    await tx.done;
};

/**
 * NEW: Updates a specific message in the cache (for reactions, edits, etc.)
 */
export const updateMessageInCache = async (conversationId, updatedMessage) => {
    const db = await dbPromise;
    const tx = db.transaction('messages', 'readwrite');
    const store = tx.objectStore('messages');
    const entry = await store.get(conversationId);

    if (!entry || !entry.messages) {
        await tx.done;
        return;
    }

    // Update the specific message in the cache
    const updatedMessages = entry.messages.map(msg =>
        msg._id === updatedMessage._id ? updatedMessage : msg
    );

    await store.put({
        id: conversationId,
        messages: updatedMessages,
        timestamp: new Date().getTime(),
    });

    await tx.done;
};

/**
 * Gets a specific message from cache
 */
export const getCachedMessage = async (conversationId, messageId) => {
    const messages = await getCachedMessages(conversationId);
    return messages.find(msg => msg._id === messageId);
};
