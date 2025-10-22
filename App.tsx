import React, { useState, useEffect, useCallback } from 'react';
import type { Agent, Message, PanelType, User } from './types';
import { MessageSender } from './types';
import { AGENTS } from './constants';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import AgentEducationPanel from './components/AgentEducationPanel';
import DocumentReviewPanel from './components/DocumentReviewPanel';
import ExportPanel from './components/ExportPanel';
import Auth from './components/Auth';
import SettingsPanel from './components/SettingsPanel';
import { generateResponse } from './services/geminiService';
import * as authService from './services/authService';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [activePanel, setActivePanel] = useState<PanelType>('chat');
  const [activeAgent, setActiveAgent] = useState<Agent>(AGENTS[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const [isDocReviewOpen, setIsDocReviewOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setTheme(user.theme || 'dark');
    }
    setAuthReady(true);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (currentUser) {
        setMessages([
          { id: 1, text: `Welcome to the ${activeAgent.name}. How can I assist you with your ${activeAgent.shortName.toLowerCase()}-related legal questions today?`, sender: MessageSender.AI }
        ]);
    }
  }, [activeAgent, currentUser]);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setTheme(user.theme || 'dark');
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setMessages([]);
  };

  const handleSaveSettings = async (settings: { apiKeys: { [provider: string]: string; }, theme: 'light' | 'dark' }) => {
    if (!currentUser) return;
    try {
        const updatedUser = await authService.updateUser({ ...currentUser, apiKeys: settings.apiKeys, theme: settings.theme });
        setCurrentUser(updatedUser);
        setTheme(settings.theme);
        setIsSettingsOpen(false);
    } catch (error) {
        console.error("Failed to save settings:", error);
    }
  };

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text,
      sender: MessageSender.USER
    };
    
    setMessages(prev => [...prev, userMessage]);

    const geminiApiKey = currentUser?.apiKeys?.gemini;
    if (!geminiApiKey) {
        const errorMessage: Message = {
            id: Date.now() + 1,
            text: "Gemini API key not found. Please add it in the Settings panel to chat with an agent.",
            sender: MessageSender.AI
        };
        setMessages(prev => [...prev, errorMessage]);
        return;
    }

    setIsThinking(true);

    try {
      const aiResponseText = await generateResponse(text, activeAgent.id, geminiApiKey);
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: aiResponseText,
        sender: MessageSender.AI
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Failed to get AI response:", error);
      const errorMessageText = error instanceof Error ? error.message : "Sorry, I encountered an error. Please try again.";
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: errorMessageText,
        sender: MessageSender.AI
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  }, [activeAgent.id, currentUser]);

  const selectAgent = (agent: Agent) => {
    setActiveAgent(agent);
    setActivePanel('chat');
    setIsSidebarOpen(false); // Close sidebar on selection
  }

  const selectAdminPanel = () => {
    setActivePanel('education');
    setIsSidebarOpen(false); // Close sidebar on selection
  }

  const renderPanel = () => {
    switch (activePanel) {
      case 'education':
        return <AgentEducationPanel currentUser={currentUser} />;
      case 'chat':
      default:
        return <ChatWindow 
                  activeAgent={activeAgent} 
                  messages={messages} 
                  onSendMessage={handleSendMessage} 
                  isThinking={isThinking}
                  onOpenDocReview={() => setIsDocReviewOpen(true)}
                  onOpenExport={() => setIsExportOpen(true)}
                  onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
                />;
    }
  };
  
  if (!authReady) {
    return <div className="flex h-screen bg-[var(--color-bg-secondary)] items-center justify-center text-[var(--color-text-primary)]">Loading...</div>;
  }

  if (!currentUser) {
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex h-screen bg-[var(--color-bg-secondary)] font-sans overflow-hidden">
      <Sidebar 
        agents={AGENTS} 
        activeAgent={activeAgent} 
        onSelectAgent={selectAgent}
        onSelectAdmin={selectAdminPanel}
        activePanel={activePanel}
        onOpenSettings={() => setIsSettingsOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
        isSidebarOpen={isSidebarOpen}
        onCloseSidebar={() => setIsSidebarOpen(false)}
      />
      <main className="flex-1 flex flex-col lg:ml-64">
        {renderPanel()}
      </main>

      {isDocReviewOpen && <DocumentReviewPanel onClose={() => setIsDocReviewOpen(false)} />}
      {isExportOpen && currentUser && <ExportPanel messages={messages} activeAgent={activeAgent} onClose={() => setIsExportOpen(false)} currentUser={currentUser} />}
      {isSettingsOpen && currentUser && <SettingsPanel user={currentUser} onSave={handleSaveSettings} onClose={() => setIsSettingsOpen(false)} />}
    </div>
  );
};

export default App;