import { kv } from '@vercel/kv';
import type { Conversation, User } from '../types';
import { AGENTS } from '../constants';

const getHistoryKey = (userEmail: string) => `chat_history_${userEmail}`;

/**
 * Retrieves all conversations for a specific user from Vercel KV.
 * @param userEmail The email of the user.
 * @returns A promise that resolves to an array of conversations, sorted by most recent first.
 */
export const getHistory = async (userEmail: string): Promise<Conversation[]> => {
  if (!userEmail) return [];
  try {
    const history = await kv.get<Conversation[]>(getHistoryKey(userEmail));
    // Sort by most recent first
    return history ? history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) : [];
  } catch (error) {
    console.error("Failed to get chat history from Vercel KV:", error);
    return [];
  }
};

/**
 * Saves a conversation to the user's chat history in Vercel KV.
 * If the conversation already exists, it is updated. Otherwise, it's added.
 * @param userEmail The email of the user.
 * @param conversation The conversation object to save.
 */
export const saveConversation = async (userEmail: string, conversation: Conversation): Promise<void> => {
  if (!userEmail) return;
  try {
    const history = await getHistory(userEmail);
    // getHistory is already sorted, so we don't need to re-sort before finding the index
    const existingIndex = history.findIndex(c => c.id === conversation.id);

    if (existingIndex !== -1) {
      history[existingIndex] = conversation;
    } else {
      // Add new conversation to the beginning of the array to maintain sort order
      history.unshift(conversation);
    }
    
    await kv.set(getHistoryKey(userEmail), history);
  } catch (error) {
    console.error("Failed to save conversation to Vercel KV:", error);
  }
};

/**
 * Deletes a specific conversation from a user's chat history.
 * @param userEmail The email of the user.
 * @param conversationId The ID of the conversation to delete.
 */
export const deleteConversation = async (userEmail: string, conversationId: string): Promise<void> => {
    if (!userEmail) return;
    try {
        let history = await getHistory(userEmail);
        history = history.filter(c => c.id !== conversationId);
        await kv.set(getHistoryKey(userEmail), history);
    } catch (error) {
        console.error("Failed to delete conversation from Vercel KV:", error);
    }
};