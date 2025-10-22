import type { ComponentType } from 'react';

export enum MessageSender {
  USER = 'user',
  AI = 'ai',
}

export interface Message {
  id: number;
  text: string;
  sender: MessageSender;
}

export interface Agent {
  id:string;
  name: string;
  shortName: string;
  description: string;
  icon: string; // Changed from ComponentType to string for image URIs
  theme: { [key: string]: string };
}

export type PanelType = 'dashboard' | 'education' | 'chat';

export interface User {
  email: string;
  apiKeys?: {
    [provider: string]: string;
  };
  theme?: 'light' | 'dark';
}

// New types for the shared knowledge base
export interface KnowledgeEntryContent {
  summary: string;
  key_concepts: string[];
  relevant_clauses: { title: string; text: string }[];
}

export interface KnowledgeEntry {
  id: string;
  agentId: string;
  url: string;
  content: KnowledgeEntryContent;
  approvedBy: string;
  approvedAt: string;
}

export interface KnowledgeBase {
  [agentId: string]: KnowledgeEntry[];
}

// New type for Chat History
export interface Conversation {
  id: string;
  agentId: string;
  messages: Message[];
  timestamp: string; // ISO string
  title: string;
}