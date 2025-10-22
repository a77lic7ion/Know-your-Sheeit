
import React from 'react';
import type { Agent, PanelType, User } from '../types';
import { AiIcon, UserIcon, LogoutIcon, HistoryIcon } from '../constants';

interface SidebarProps {
  agents: Agent[];
  activeAgent: Agent;
  onSelectAgent: (agent: Agent) => void;
  onSelectAdmin: () => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  activePanel: PanelType;
  currentUser: User | null;
  onLogout: () => void;
  isSidebarOpen: boolean;
  onCloseSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ agents, activeAgent, onSelectAgent, onSelectAdmin, onOpenSettings, onOpenHistory, activePanel, currentUser, onLogout, isSidebarOpen, onCloseSidebar }) => {
  const NavItem: React.FC<{
    agent?: Agent;
    label: string;
    isActive: boolean;
    onClick: () => void;
    icon: React.ComponentType<{ className?: string }> | string;
  }> = ({ label, isActive, onClick, icon }) => (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-3 py-2.5 text-sm text-left rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-gray-700 text-white'
          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
      }`}
    >
      {typeof icon === 'string' ? (
        <img src={icon} alt={`${label} icon`} className="w-5 h-5 mr-3 flex-shrink-0" />
      ) : (
        React.createElement(icon, { className: 'w-5 h-5 mr-3 flex-shrink-0' })
      )}
      <span className="truncate">{label}</span>
    </button>
  );

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onCloseSidebar}
      ></div>
      <aside className={`fixed top-0 left-0 h-full w-64 bg-[#161B22] p-4 flex flex-col border-r border-gray-700 z-30 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="bg-cyan-500 p-2 rounded-lg mr-3">
                <AiIcon className="w-6 h-6 text-white"/>
            </div>
            <h1 className="text-lg font-bold">AI Legal Assistant</h1>
          </div>
          <button onClick={onCloseSidebar} className="lg:hidden text-gray-400 hover:text-white">
            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto">
          {agents.map((agent) => (
            <NavItem
              key={agent.id}
              agent={agent}
              label={agent.name}
              isActive={activeAgent.id === agent.id && activePanel === 'chat'}
              onClick={() => onSelectAgent(agent)}
              icon={agent.icon}
            />
          ))}
        </nav>

        <div className="mt-auto pt-2 space-y-2 flex-shrink-0">
          <NavItem
              label="History"
              isActive={false}
              onClick={onOpenHistory}
              icon={HistoryIcon}
          />
          <NavItem
              label="Agent Education"
              isActive={activePanel === 'education'}
              onClick={onSelectAdmin}
              icon={({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 3.104v5.62c0 .363.188.706.505.905l4.5 2.813M9.75 15.104v5.62c0 .363.188.706.505.905l4.5 2.813M4.5 8.354l4.5-2.813m0 11.25l-4.5-2.813m15-5.625v5.62a2.25 2.25 0 01-.505.905l-4.5 2.813m4.5-11.25l-4.5-2.813a2.25 2.25 0 00-2.016 0L9.25 5.541m7.5 11.25l-4.5-2.813" /></svg>}
          />
          <NavItem
              label="Settings"
              isActive={false}
              onClick={onOpenSettings}
              icon={({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066 2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>}
          />
          <div className="border-t border-gray-700 my-2"></div>
          {currentUser && (
              <div className="flex items-center justify-between w-full px-3 py-2.5 text-sm text-left rounded-lg text-gray-400">
                  <div className="flex items-center overflow-hidden">
                      <UserIcon className="w-5 h-5 mr-3 rounded-full flex-shrink-0"/>
                      <span className="truncate" title={currentUser.email}>{currentUser.email}</span>
                  </div>
                  <button onClick={onLogout} className="text-gray-500 hover:text-red-500 transition-colors" title="Logout">
                      <LogoutIcon className="w-5 h-5" />
                  </button>
              </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;