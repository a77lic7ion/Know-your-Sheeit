
import React, { useRef, useEffect } from 'react';
import type { Agent, Message } from '../types';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';

interface ChatWindowProps {
  activeAgent: Agent;
  messages: Message[];
  onSendMessage: (text: string) => void;
  isThinking: boolean;
  onOpenDocReview: () => void;
  onOpenExport: () => void;
  onToggleSidebar: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ activeAgent, messages, onSendMessage, isThinking, onOpenDocReview, onOpenExport, onToggleSidebar }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isThinking]);
  
  const HeaderButton: React.FC<{onClick?: () => void, children: React.ReactNode, tooltip: string}> = ({ onClick, children, tooltip }) => (
    <button onClick={onClick} className="text-gray-400 hover:text-white relative group">
        {children}
        <span className="tooltip">{tooltip}</span>
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-[#0D1117]">
      <header className="flex items-center justify-between p-4 border-b border-gray-700 sticky top-0 bg-[#0D1117]/80 backdrop-blur-sm z-10">
        <div className="flex items-center">
            <button onClick={onToggleSidebar} className="lg:hidden mr-3 text-gray-400 hover:text-white">
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>
            <img src={activeAgent.icon} alt={activeAgent.name} className="w-8 h-8 mr-3 rounded-md object-cover" />
            <h2 className="text-xl font-semibold truncate">{activeAgent.name}</h2>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
            <HeaderButton tooltip="Search">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </HeaderButton>
            <HeaderButton onClick={onOpenExport} tooltip="Export Conversation">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            </HeaderButton>
            <HeaderButton onClick={onOpenDocReview} tooltip="Review Document">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </HeaderButton>
            <HeaderButton tooltip="More Actions">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg>
            </HeaderButton>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} agentIcon={activeAgent.icon}/>
        ))}
        {isThinking && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2">
              <img src={activeAgent.icon} alt={activeAgent.name} className="w-8 h-8 p-1 bg-gray-700 rounded-full object-cover" />
              <div className="bg-[#21262D] rounded-lg px-4 py-2 flex items-center">
                <span className="text-gray-400">Thinking</span>
                <span className="animate-bounce text-gray-400 ml-1">.</span>
                <span className="animate-bounce delay-150 text-gray-400">.</span>
                <span className="animate-bounce delay-300 text-gray-400">.</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-700 bg-[#0D1117]">
        <ChatInput onSendMessage={onSendMessage} isThinking={isThinking} />
      </div>
    </div>
  );
};

export default ChatWindow;