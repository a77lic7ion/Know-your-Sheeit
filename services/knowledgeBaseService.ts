import type { KnowledgeBase, KnowledgeEntry } from '../types';

const KNOWLEDGE_BASE_KEY = 'legal_ai_shared_knowledge_base';

/**
 * Retrieves the entire knowledge base from local storage.
 * @returns The knowledge base object.
 */
export const getKnowledgeBase = (): KnowledgeBase => {
  try {
    const storedData = localStorage.getItem(KNOWLEDGE_BASE_KEY);
    return storedData ? JSON.parse(storedData) : {};
  } catch (error) {
    console.error("Failed to parse knowledge base from localStorage:", error);
    return {};
  }
};

/**
 * Saves the entire knowledge base to local storage.
 * @param knowledgeBase The knowledge base object to save.
 */
const saveKnowledgeBase = (knowledgeBase: KnowledgeBase) => {
  try {
    localStorage.setItem(KNOWLEDGE_BASE_KEY, JSON.stringify(knowledgeBase));
  } catch (error) {
    console.error("Failed to save knowledge base to localStorage:", error);
  }
};

/**
 * Adds a new entry to the knowledge base.
 * @param newEntry The knowledge entry to add.
 */
export const addKnowledgeEntry = (newEntry: KnowledgeEntry) => {
  const knowledgeBase = getKnowledgeBase();
  
  if (!knowledgeBase[newEntry.agentId]) {
    knowledgeBase[newEntry.agentId] = [];
  }
  
  // Avoid adding duplicates based on URL
  const existingEntryIndex = knowledgeBase[newEntry.agentId].findIndex(entry => entry.url === newEntry.url);
  
  if (existingEntryIndex !== -1) {
    // If it exists, update it
    knowledgeBase[newEntry.agentId][existingEntryIndex] = newEntry;
  } else {
    // Otherwise, add it
    knowledgeBase[newEntry.agentId].push(newEntry);
  }
  
  saveKnowledgeBase(knowledgeBase);
};

/**
 * Retrieves all knowledge entries for a specific agent.
 * @param agentId The ID of the agent.
 * @returns An array of knowledge entries for the agent.
 */
export const getKnowledgeForAgent = (agentId: string): KnowledgeEntry[] => {
  const knowledgeBase = getKnowledgeBase();
  return knowledgeBase[agentId] || [];
};

/**
 * Deletes a knowledge entry from the knowledge base.
 * @param entryId The ID of the entry to delete.
 * @param agentId The agentId under which the entry is stored.
 */
export const deleteKnowledgeEntry = (entryId: string, agentId: string) => {
    const knowledgeBase = getKnowledgeBase();
    if (knowledgeBase[agentId]) {
        knowledgeBase[agentId] = knowledgeBase[agentId].filter(entry => entry.id !== entryId);
        // FIX: Corrected typo from knowledge_base to knowledgeBase
        saveKnowledgeBase(knowledgeBase);
    }
};