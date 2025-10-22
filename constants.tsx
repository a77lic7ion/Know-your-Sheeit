// Fix: Import React to use React.FC and JSX
import React from 'react';
import type { Agent } from './types';

export const UserIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></svg>
);
export const AiIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M19.96 11.44c-.2-.49-.25-.97-.25-1.44 0-2.76-2.24-5-5-5s-5 2.24-5 5c0 .47.05.95.25 1.44-1.49.52-2.73 1.76-3.21 3.25-.23.72-.35 1.48-.35 2.25 0 2.24 1.76 4.06 4 4.06.35 0 .68-.06.96-.15.82.63 1.83 1 2.94 1s2.12-.37 2.94-1c.28.09.61.15.96.15 2.24 0 4-1.82 4-4.06 0-.77-.12-1.53-.35-2.25-.48-1.49-1.72-2.73-3.21-3.25zM12 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"></path></svg>
);
export const PopiaIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c.966 0 1.75-.784 1.75-1.75S12.966 7.5 12 7.5s-1.75.784-1.75 1.75S11.034 11 12 11zm0 0v2.5m0 3.5v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);
export const RentalIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.5 1.5 0 012.122 0l8.954 8.955M2.25 12l8.954 8.955a1.5 1.5 0 002.122 0l8.954-8.955M12 21V3"></path></svg>
);
export const ConsumerIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.658-.463 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"></path></svg>
);
export const GeneralIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 22.5l-.648-1.938a2.25 2.25 0 01-1.423-1.423L12 18.75l1.938-.648a2.25 2.25 0 011.423-1.423L17.25 15l.648 1.938a2.25 2.25 0 011.423 1.423L21.25 18.75l-1.938.648a2.25 2.25 0 01-1.423 1.423z"></path></svg>
);
export const LogoutIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"></path></svg>
);

export const AGENTS: Agent[] = [
  { id: 'popia', name: 'POPIA Agent', shortName: 'POPIA', description: 'Your guide to the Protection of Personal Information Act.', icon: PopiaIcon },
  { id: 'rental', name: 'Rental Law Agent', shortName: 'Rental Law', description: 'Assistance with rental housing agreements and disputes.', icon: RentalIcon },
  { id: 'consumer', name: 'Consumer Protection Agent', shortName: 'Consumer Protection', description: 'Understand your rights as a consumer.', icon: ConsumerIcon },
  { id: 'general', name: 'General Legal', shortName: 'General Legal', description: 'For general legal queries and triage.', icon: GeneralIcon },
];