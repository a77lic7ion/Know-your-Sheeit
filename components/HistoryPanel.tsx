import React, { useState, useEffect } from 'react';
import type { Conversation, User } from '../types';
import * as chatHistoryService from '../services/chatHistoryService';
import { AGENTS } from '../constants';

interface HistoryPanelProps {
  onClose: () => void;
  onSelectConversation: (conversation: Conversation) => void;
  onNewChat: () => void;
  currentUser: User;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ onClose, onSelectConversation, onNewChat, currentUser }) => {
  const [history, setHistory] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      if (currentUser?.email) {
        const userHistory = await chatHistoryService.getHistory(currentUser.email);
        setHistory(userHistory);
      }
      setIsLoading(false);
    };
    fetchHistory();
  }, [currentUser.email]);
  
  const getAgentIcon = (agentId: string) => {
    return AGENTS.find(agent => agent.id === agentId)?.icon || '';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-start z-50">
      <div className="w-full sm:w-80 bg-[var(--color-bg-primary)] h-full p-4 shadow-2xl flex flex-col animate-slide-in-left">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Chat History</h2>
          <button onClick={onClose} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
          </button>
        </div>
        
        <button onClick={onNewChat} className="w-full bg-cyan-600 text-white py-2.5 rounded-md hover:bg-cyan-500 transition-colors mb-4 text-sm font-semibold">
            + New Chat
        </button>

        <div className="flex-1 overflow-y-auto pr-2 space-y-2">
            {isLoading ? (
                <div className="text-center text-gray-400">Loading history...</div>
            ) : history.length === 0 ? (
                <div className="text-center text-gray-500 pt-10">No past conversations found.</div>
            ) : (
                history.map(conv => (
                    <button 
                        key={conv.id}
                        onClick={() => onSelectConversation(conv)}
                        className="w-full text-left p-3 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors"
                    >
                        <div className="flex items-center">
                            <img src={getAgentIcon(conv.agentId)} alt="agent" className="w-6 h-6 rounded mr-3" />
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">{conv.title}</p>
                                <p className="text-xs text-[var(--color-text-secondary)] mt-1">{new Date(conv.timestamp).toLocaleString()}</p>
                            </div>
                        </div>
                    </button>
                ))
            )}
        </div>
      </div>
       <style>{`
        @keyframes slide-in-left {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-left { animation: slide-in-left 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default HistoryPanel;