import React from 'react';
import type { Agent } from './types';

// --- AGENT ICONS (BASE64) ---
// FIX: Use template literal for multi-line string
const POPIA_ICON_B64 = `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/wwBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAJAAkADASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAAAAECA//EABwQAQEBAQACAwAAAAAAAAAAAAABEQISAyExQf/EABYBAQEBAAAAAAAAAAAAAAAAAAABAv/EABYRAQEBAAAAAAAAAAAAAAAAAAARAf/aAAwDAQACEQMRAD8A8qACiKCgACgAAAAAAAAAAAAAAIKIoKAAigAoAIoKAIoKAIoKCCgAoAIoKAIoKCCgAoAIoKCCgAoACCgAAAAgoACCgAAAAIKACCgAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAgAAAAg`;
const RENTAL_ICON_B64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1" + "PMOiAAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
const CONSUMER_ICON_B64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1" + "PMOiAAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
const GENERAL_ICON_B64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1" + "PMOiAAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

export const AiIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14.25 6c0 1.5-1.5 3-3.75 3S6.75 7.5 6.75 6s1.5-3 3.75-3 3.75 1.5 3.75 3zM4.125 8.783c.852.274 1.522.69 2.016 1.157.1.092.19.18.27.262.333.33.516.63.535.631a.75.75 0 010 1.06L5.75 13.086a.75.75 0 01-1.06 0l-.364-.364a.75.75 0 010-1.06l1.263-1.263-.84-1.263a.75.75 0 01.376-1.393zM18.375 8.783c-.852.274-1.522.69-2.016 1.157a4.993 4.993 0 00-.27.262c-.333.33-.516.63-.535.631a.75.75 0 000 1.06l1.197 1.194a.75.75 0 001.06 0l.364-.364a.75.75 0 000-1.06L17.03 10.53l.84-1.263a.75.75 0 00-.376-1.393zM12 12.75a5.25 5.25 0 005.25-5.25H6.75A5.25 5.25 0 0012 12.75zM2.25 15a.75.75 0 000 1.5c.741 1.63 2.193 2.822 4.01 3.531C7.81 20.58 9.773 21 12 21s4.19-.42 5.74-1.186c1.817-.71 3.27-1.9 4.01-3.531a.75.75 0 000-1.5H2.25z" />
  </svg>
);

export const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
    </svg>
);

export const LogoutIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z" clipRule="evenodd" />
    </svg>
);


export const AGENTS: Agent[] = [
  {
    id: 'popia',
    name: 'POPIA Expert',
    shortName: 'POPIA',
    description: 'Specializes in the Protection of Personal Information Act.',
    icon: POPIA_ICON_B64,
    theme: {
        '--color-bg-primary': '#1A2238',
        '--color-bg-secondary': '#12182B',
        '--color-bg-tertiary': '#222B45',
        '--color-border-primary': '#2F3A5F',
        '--color-text-primary': '#F7F9FC',
        '--color-text-secondary': '#9DA3B0',
        '--color-accent-primary': '#4A90E2',
        '--color-accent-secondary': '#50E3C2',
    }
  },
  {
    id: 'rental',
    name: 'Rental Law Advisor',
    shortName: 'Rental Law',
    description: 'Advises on the Rental Housing Act and landlord/tenant rights.',
    icon: RENTAL_ICON_B64,
    theme: {
        '--color-bg-primary': '#1E2A2D',
        '--color-bg-secondary': '#162023',
        '--color-bg-tertiary': '#2A3C40',
        '--color-border-primary': '#3A5055',
        '--color-text-primary': '#E8F1F2',
        '--color-text-secondary': '#AABBC0',
        '--color-accent-primary': '#50E3C2',
        '--color-accent-secondary': '#F5A623',
    }
  },
  {
    id: 'consumer',
    name: 'Consumer Rights Pro',
    shortName: 'CPA',
    description: 'Expert on the Consumer Protection Act.',
    icon: CONSUMER_ICON_B64,
    theme: {
        '--color-bg-primary': '#2E231F',
        '--color-bg-secondary': '#231B17',
        '--color-bg-tertiary': '#40312C',
        '--color-border-primary': '#57453E',
        '--color-text-primary': '#FDF8F6',
        '--color-text-secondary': '#C4B8B3',
        '--color-accent-primary': '#F5A623',
        '--color-accent-secondary': '#D0021B',
    }
  },
  {
    id: 'general',
    name: 'General Legal Asst.',
    shortName: 'General',
    description: 'Provides general legal information and routes to specialists.',
    icon: GENERAL_ICON_B64,
    theme: {
        '--color-bg-primary': '#1F2926',
        '--color-bg-secondary': '#171F1C',
        '--color-bg-tertiary': '#2C3A35',
        '--color-border-primary': '#3E5249',
        '--color-text-primary': '#F3FAF7',
        '--color-text-secondary': '#B3C1BA',
        '--color-accent-primary': '#7ED321',
        '--color-accent-secondary': '#4A90E2',
    }
  },
];
