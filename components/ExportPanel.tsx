
import React, { useState, useEffect } from 'react';
import type { Agent, Message } from '../types';
import { MessageSender } from '../types';
import { formatConversationForExport } from '../services/geminiService';


interface ExportPanelProps {
  onClose: () => void;
  messages: Message[];
  activeAgent: Agent;
}

const ExportPanel: React.FC<ExportPanelProps> = ({ onClose, messages, activeAgent }) => {
  const [activeTab, setActiveTab] = useState('pdf');
  const [exportContent, setExportContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    const generateContent = async () => {
      setIsLoading(true);
      setCopySuccess('');

      const chatLog = messages.map(msg => {
        const prefix = msg.sender === MessageSender.USER ? 'You' : activeAgent.name;
        return `${prefix}: ${msg.text}`;
      }).join('\n\n');
      
      if (activeTab === 'pdf') {
        setExportContent(chatLog);
        setIsLoading(false);
      } else if (activeTab === 'letter' || activeTab === 'email') {
        try {
          const formattedContent = await formatConversationForExport(chatLog, activeTab as 'letter' | 'email', activeAgent.name);
          setExportContent(formattedContent);
        } catch (error) {
          console.error(error);
          setExportContent('Sorry, there was an error generating the document. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    generateContent();
  }, [activeTab, messages, activeAgent]);

  const handleDownload = () => {
    const blob = new Blob([exportContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const fileName = activeTab === 'pdf' ? 'conversation-export.txt' : `${activeTab}-draft.txt`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = () => {
    if (!navigator.clipboard) {
        setCopySuccess('Copy API not supported.');
        setTimeout(() => setCopySuccess(''), 2000);
        return;
    }
    navigator.clipboard.writeText(exportContent).then(() => {
      setCopySuccess('Copied to clipboard!');
      setTimeout(() => setCopySuccess(''), 2000);
    }, () => {
      setCopySuccess('Failed to copy!');
      setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  const TabButton: React.FC<{ id: string; label: string; icon: React.ReactElement }> = ({ id, label, icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center w-full p-3 rounded-lg text-left transition-colors ${
        activeTab === id ? 'bg-gray-700 text-white' : 'hover:bg-gray-800 text-gray-300'
      }`}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </button>
  );

  const Toggle: React.FC<{ label: string; icon: React.ReactElement; defaultChecked?: boolean }> = ({ label, icon, defaultChecked = false }) => (
     <div className="flex items-center justify-between text-gray-300">
        <div className="flex items-center">
            {icon}
            <span className="ml-3 text-sm">{label}</span>
        </div>
        <label htmlFor={`toggle-${label}`} className="flex items-center cursor-pointer">
            <div className="relative">
                <input type="checkbox" id={`toggle-${label}`} className="sr-only" defaultChecked={defaultChecked} />
                <div className="block bg-gray-600 w-10 h-6 rounded-full"></div>
                <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
            </div>
        </label>
    </div>
  );

  const renderMainButton = () => {
    const buttonBaseClasses = "mt-auto w-full text-white py-2.5 rounded-md transition-colors font-semibold";
    if (activeTab === 'pdf') {
        return (
            <button onClick={handleDownload} className={`${buttonBaseClasses} bg-cyan-600 hover:bg-cyan-500`}>
                Download .txt
            </button>
        );
    }
    return (
         <button onClick={handleCopy} className={`${buttonBaseClasses} ${copySuccess ? 'bg-green-600' : 'bg-cyan-600 hover:bg-cyan-500'}`}>
            {copySuccess || 'Copy to Clipboard'}
        </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#161B22] rounded-lg shadow-2xl w-full max-w-3xl flex overflow-hidden max-h-[90vh]">
        {/* Left Side */}
        <div className="w-1/3 bg-[#0D1117] p-6 flex flex-col border-r border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Export Conversation</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            </button>
          </div>
          <div className="space-y-2">
            <TabButton id="pdf" label="Export as Text" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>} />
            <TabButton id="letter" label="Draft Formal Letter" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>} />
            <TabButton id="email" label="Compose Email" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg>} />
          </div>
          {renderMainButton()}
        </div>
        {/* Right Side */}
        <div className="w-2/3 p-6 flex flex-col">
          <h3 className="font-semibold text-lg mb-4">Preview</h3>
          <div className="flex-1 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700 p-2">
             {isLoading ? (
                <div className="text-center text-gray-400 flex flex-col items-center">
                    <svg className="animate-spin h-8 w-8 text-cyan-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-sm">Generating preview...</p>
                </div>
             ) : (
                <textarea
                    readOnly
                    value={exportContent}
                    className="w-full h-full bg-transparent text-gray-300 text-sm resize-none border-none focus:ring-0 p-2"
                    placeholder="Export content will appear here."
                />
             )}
          </div>
          <div className="mt-6 space-y-4">
            <h3 className="font-semibold text-lg">Settings</h3>
            <Toggle label="Include timestamps" icon={<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>} defaultChecked={true} />
            <Toggle label="Add watermark" icon={<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>} />
            <Toggle label="Encrypt with password" icon={<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>} />
          </div>
        </div>
      </div>
      <style>{`
          input:checked + div > .dot {
            transform: translateX(100%);
            background-color: #2DD4BF; /* teal-400 */
          }
          input:checked + div {
            background-color: #047857; /* green-700 */
          }
        `}</style>
    </div>
  );
};

export default ExportPanel;
