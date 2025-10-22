
import React, { useState, useEffect, useCallback } from 'react';
import type { Agent, Message, PanelType } from './types';
import { MessageSender } from './types';
import { AGENTS } from './constants';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import AgentEducationPanel from './components/AgentEducationPanel';
import SettingsPanel from './components/SettingsPanel';
import DocumentReviewPanel from './components/DocumentReviewPanel';
import ExportPanel from './components/ExportPanel';
import { generateResponse } from './services/geminiService';

const App: React.FC = () => {
  const [activePanel, setActivePanel] = useState<PanelType>('chat');
  const [activeAgent, setActiveAgent] = useState<Agent>(AGENTS[1]);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDocReviewOpen, setIsDocReviewOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    setMessages([
      { id: 1, text: `Welcome to the ${activeAgent.name}. How can I assist you with your ${activeAgent.shortName.toLowerCase()}-related legal questions today?`, sender: MessageSender.AI }
    ]);
  }, [activeAgent]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text,
      sender: MessageSender.USER
    };

    setMessages(prev => [...prev, userMessage]);
    setIsThinking(true);

    try {
      const aiResponseText = await generateResponse(text, activeAgent.id);
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: aiResponseText,
        sender: MessageSender.AI
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Failed to get AI response:", error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Sorry, I encountered an error. Please try again.",
        sender: MessageSender.AI
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  }, [activeAgent.id]);

  const selectAgent = (agent: Agent) => {
    setActiveAgent(agent);
    setActivePanel('chat');
  }

  const renderPanel = () => {
    switch (activePanel) {
      case 'education':
        return <AgentEducationPanel />;
      case 'chat':
      default:
        return <ChatWindow 
                  activeAgent={activeAgent} 
                  messages={messages} 
                  onSendMessage={handleSendMessage} 
                  isThinking={isThinking}
                  onOpenDocReview={() => setIsDocReviewOpen(true)}
                  onOpenExport={() => setIsExportOpen(true)}
                />;
    }
  };

  return (
    <div className="flex h-screen bg-[#0D1117] font-sans">
      <Sidebar 
        agents={AGENTS} 
        activeAgent={activeAgent} 
        onSelectAgent={selectAgent}
        onSelectAdmin={() => setActivePanel('education')}
        onSelectSettings={() => setIsSettingsOpen(true)}
        activePanel={activePanel}
      />
      <main className="flex-1 flex flex-col">
        {renderPanel()}
      </main>

      {isSettingsOpen && <SettingsPanel onClose={() => setIsSettingsOpen(false)} />}
      {isDocReviewOpen && <DocumentReviewPanel onClose={() => setIsDocReviewOpen(false)} />}
      {isExportOpen && <ExportPanel onClose={() => setIsExportOpen(false)} />}
    </div>
  );
};

export default App;
