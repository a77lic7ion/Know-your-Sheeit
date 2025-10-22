import React, { useState } from 'react';

interface ExportPanelProps {
  onClose: () => void;
}

const ExportPanel: React.FC<ExportPanelProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('pdf');

  // Fix: Replaced JSX.Element with React.ReactElement to resolve namespace issue.
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

  // Fix: Replaced JSX.Element with React.ReactElement to resolve namespace issue.
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#161B22] rounded-lg shadow-2xl w-full max-w-3xl flex overflow-hidden">
        {/* Left Side */}
        <div className="w-1/3 bg-[#0D1117] p-6 flex flex-col border-r border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Export Conversation</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            </button>
          </div>
          <div className="space-y-2">
            <TabButton id="pdf" label="Export as PDF" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>} />
            <TabButton id="letter" label="Draft Formal Letter" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>} />
            <TabButton id="email" label="Compose Email" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg>} />
          </div>
          <button className="mt-auto w-full bg-cyan-600 text-white py-2.5 rounded-md hover:bg-cyan-500 transition-colors">Export Now</button>
        </div>
        {/* Right Side */}
        <div className="w-2/3 p-6 flex flex-col">
          <h3 className="font-semibold text-lg mb-4">Preview</h3>
          <div className="flex-1 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700">
             <div className="bg-teal-900/50 p-8 rounded-lg shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-teal-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                    <path d="M8 8a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm1 3a1 1 0 100 2h2a1 1 0 100-2H9z" />
                </svg>
            </div>
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