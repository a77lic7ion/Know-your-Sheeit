import { kv } from '@vercel/kv';
import type { KnowledgeBase, KnowledgeEntry } from '../types';

const KNOWLEDGE_BASE_KEY = 'legal_ai_shared_knowledge_base';

/**
 * Retrieves the entire knowledge base from Vercel KV.
 * @returns A promise that resolves to the knowledge base object.
 */
export const getKnowledgeBase = async (): Promise<KnowledgeBase> => {
  try {
    console.log("Attempting to get knowledge base from KV store...");
    const storedData = await kv.get<KnowledgeBase>(KNOWLEDGE_BASE_KEY);
    console.log("Retrieved raw data from KV store:", storedData);
    return storedData || {};
  } catch (error) {
    console.error("Failed to parse knowledge base from Vercel KV:", error);
    return {};
  }
};

/**
 * Saves the entire knowledge base to Vercel KV.
 * @param knowledgeBase The knowledge base object to save.
 */
const saveKnowledgeBase = async (knowledgeBase: KnowledgeBase): Promise<void> => {
  try {
    console.log("Saving knowledge base to KV store:", JSON.stringify(knowledgeBase, null, 2));
    await kv.set(KNOWLEDGE_BASE_KEY, knowledgeBase);
    console.log("Knowledge base save call completed.");
    // Verify the write operation
    const verify = await kv.get(KNOWLEDGE_BASE_KEY);
    console.log("Verification read from KV store:", verify);
  } catch (error) {
    console.error("Failed to save knowledge base to Vercel KV:", error);
  }
};

/**
 * Adds a new entry to the knowledge base.
 * @param newEntry The knowledge entry to add.
 */
export const addKnowledgeEntry = async (newEntry: KnowledgeEntry): Promise<void> => {
  const knowledgeBase = await getKnowledgeBase();
  
  if (!knowledgeBase[newEntry.agentId]) {
    knowledgeBase[newEntry.agentId] = [];
  }
  
  const existingEntryIndex = knowledgeBase[newEntry.agentId].findIndex(entry => entry.url === newEntry.url);
  
  if (existingEntryIndex !== -1) {
    knowledgeBase[newEntry.agentId][existingEntryIndex] = newEntry;
  } else {
    knowledgeBase[newEntry.agentId].push(newEntry);
  }
  
  await saveKnowledgeBase(knowledgeBase);
};

/**
 * Retrieves all knowledge entries for a specific agent from Vercel KV.
 * @param agentId The ID of the agent.
 * @returns A promise that resolves to an array of knowledge entries.
 */
export const getKnowledgeForAgent = async (agentId: string): Promise<KnowledgeEntry[]> => {
  const knowledgeBase = await getKnowledgeBase();
  return knowledgeBase[agentId] || [];
};

/**
 * Deletes a knowledge entry from the knowledge base in Vercel KV.
 * @param entryId The ID of the entry to delete.
 * @param agentId The agentId under which the entry is stored.
 */
export const deleteKnowledgeEntry = async (entryId: string, agentId: string): Promise<void> => {
    const knowledgeBase = await getKnowledgeBase();
    if (knowledgeBase[agentId]) {
        knowledgeBase[agentId] = knowledgeBase[agentId].filter(entry => entry.id !== entryId);
        await saveKnowledgeBase(knowledgeBase);
    }
};