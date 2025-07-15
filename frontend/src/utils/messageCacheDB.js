import { openDB } from 'idb';

const dbPromise = openDB('chat-db', 1, {
  upgrade(db) {
    db.createObjectStore('messages', { keyPath: 'id' }); // id = conversationId
  },
});

export const getCachedMessages = async (conversationId) => {
  const db = await dbPromise;
  const entry = await db.get('messages', conversationId);
  return entry?.messages || [];
};

export const setCachedMessages = async (conversationId, messages) => {
  const db = await dbPromise;
  const timestamp = new Date().getTime();
  await db.put('messages', { id: conversationId, messages, timestamp });
};

export const addOlderMessages = async (conversationId, olderMessages) => {
  const db = await dbPromise;
  const entry = await db.get('messages', conversationId);
  const combined = [...olderMessages, ...(entry?.messages || [])];
  await db.put('messages', { id: conversationId, messages: combined, timestamp: new Date().getTime() });
};
