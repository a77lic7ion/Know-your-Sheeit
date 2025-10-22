// Fix: Import ComponentType from react
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
  // Fix: Use ComponentType directly
  icon: ComponentType<{ className?: string }>;
}

export type PanelType = 'dashboard' | 'education' | 'chat';

export interface User {
  email: string;
}
