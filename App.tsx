import React, { useState, useEffect, useCallback } from 'react';
import type { Agent, Message, PanelType, User, Conversation } from './types';
import { MessageSender } from './types';
import { AGENTS } from './constants';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import AgentEducationPanel from './components/AgentEducationPanel';
import DocumentReviewPanel from './components/DocumentReviewPanel';
import ExportPanel from './components/ExportPanel';
import Auth from './components/Auth';
import SettingsPanel from './components/SettingsPanel';
import HistoryPanel from './components/HistoryPanel';
import { generateResponse } from './services/geminiService';
import * as authService from './services/authService';
import * as chatHistoryService from './services/chatHistoryService';


const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [activePanel, setActivePanel] = useState<PanelType>('chat');
  const [activeAgent, setActiveAgent] = useState<Agent>(AGENTS[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  
  const [isDocReviewOpen, setIsDocReviewOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [originalTheme, setOriginalTheme] = useState<'light' | 'dark'>('dark');


  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      const userTheme = user.theme || 'dark';
      setTheme(userTheme);
      setOriginalTheme(userTheme);
    }
    setAuthReady(true);
  }, []);
  
  const handleNewChat = useCallback((agentToUse: Agent = activeAgent) => {
    setCurrentConversationId(null);
    setMessages([
      { id: 1, text: `Welcome to the ${agentToUse.name}. How can I assist you with your ${agentToUse.shortName.toLowerCase()}-related legal questions today?`, sender: MessageSender.AI }
    ]);
    if (isHistoryOpen) setIsHistoryOpen(false);
  }, [activeAgent, isHistoryOpen]);


  useEffect(() => {
    if (currentUser && !currentConversationId) {
        handleNewChat(activeAgent);
    }
  }, [currentUser, currentConversationId, activeAgent, handleNewChat]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleLoginSuccess = (user: User) => {
    const userTheme = user.theme || 'dark';
    setCurrentUser(user);
    setTheme(userTheme);
    setOriginalTheme(userTheme);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setMessages([]);
    setCurrentConversationId(null);
  };

  const handleOpenSettings = () => {
    setOriginalTheme(theme);
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setTheme(originalTheme);
    setIsSettingsOpen(false);
  };

  const handleSaveSettings = async (settings: { apiKeys: { [provider: string]: string; }}) => {
    if (!currentUser) return;
    try {
        const updatedUser = await authService.updateUser({ ...currentUser, apiKeys: settings.apiKeys, theme: theme });
        setCurrentUser(updatedUser);
        setOriginalTheme(theme);
        setIsSettingsOpen(false);
    } catch (error) {
        console.error("Failed to save settings:", error);
    }
  };

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || !currentUser) return;

    const userMessage: Message = {
      id: Date.now(),
      text,
      sender: MessageSender.USER
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsThinking(true);

    const geminiApiKey = currentUser.apiKeys?.gemini;
    if (!geminiApiKey) {
        const errorMessage: Message = {
            id: Date.now() + 1,
            text: "Gemini API key not found. Please add it in the Settings panel to chat with an agent.",
            sender: MessageSender.AI
        };
        setMessages(prev => [...prev, errorMessage]);
        setIsThinking(false);
        return;
    }

    let aiResponseText: string;
    try {
      aiResponseText = await generateResponse(text, activeAgent.id, geminiApiKey);
    } catch (error) {
      console.error("Failed to get AI response:", error);
      aiResponseText = error instanceof Error ? error.message : "Sorry, I encountered an error. Please try again.";
    }

    const aiMessage: Message = {
      id: Date.now() + 1,
      text: aiResponseText,
      sender: MessageSender.AI
    };

    let savedConversation: Conversation | null = null;

    setMessages(prevMessages => {
        const finalMessages = [...prevMessages, aiMessage];
        const convId = currentConversationId || `conv-${Date.now()}`;
        
        savedConversation = {
            id: convId,
            agentId: activeAgent.id,
            messages: finalMessages,
            timestamp: new Date().toISOString(),
            title: finalMessages.find(m => m.sender === MessageSender.USER)?.text.substring(0, 50) || 'New Conversation'
        };

        if (!currentConversationId) {
            setCurrentConversationId(convId);
        }

        return finalMessages;
    });

    setIsThinking(false);
    
    if (savedConversation) {
        await chatHistoryService.saveConversation(currentUser.email, savedConversation);
    }

  }, [activeAgent.id, currentUser, currentConversationId]);

  const selectAgent = (agent: Agent) => {
    setActiveAgent(agent);
    setActivePanel('chat');
    setIsSidebarOpen(false); 
    handleNewChat(agent);
  }
  
  const handleSelectConversation = (conversation: Conversation) => {
    const agent = AGENTS.find(a => a.id === conversation.agentId) || AGENTS[0];
    setActiveAgent(agent);
    setMessages(conversation.messages);
    setCurrentConversationId(conversation.id);
    setActivePanel('chat');
    setIsHistoryOpen(false);
  };

  const selectAdminPanel = () => {
    setActivePanel('education');
    setIsSidebarOpen(false);
  }

  const renderPanel = () => {
    switch (activePanel) {
      case 'education':
        return <AgentEducationPanel 
                  currentUser={currentUser} 
                  onBackToChat={() => setActivePanel('chat')} 
                />;
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
        onOpenSettings={handleOpenSettings}
        onOpenHistory={() => setIsHistoryOpen(true)}
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
      {isSettingsOpen && currentUser && (
        <SettingsPanel 
          user={currentUser} 
          onSave={handleSaveSettings} 
          onClose={handleCloseSettings}
          currentTheme={theme}
          onThemeChange={setTheme}
        />
      )}
      {isHistoryOpen && currentUser && (
        <HistoryPanel
          currentUser={currentUser}
          onClose={() => setIsHistoryOpen(false)}
          onSelectConversation={handleSelectConversation}
          onNewChat={() => handleNewChat()}
        />
      )}
    </div>
  );
};

export default App;