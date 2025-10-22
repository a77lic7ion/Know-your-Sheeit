
import React, { useState } from 'react';

interface SettingsPanelProps {
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose }) => {
  
  const APIKeyInput: React.FC<{ label: string }> = ({ label }) => {
    const [isVisible, setIsVisible] = useState(false);
    return (
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
        <div className="relative">
          <input
            type={isVisible ? 'text' : 'password'}
            defaultValue="••••••••••••••••••"
            className="w-full bg-[#2d333a] border border-gray-600 rounded-md p-2 text-gray-200 focus:ring-cyan-500 focus:border-cyan-500"
          />
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="absolute inset-y-0 right-0 px-3 text-gray-400 hover:text-white"
          >
            {isVisible ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59"></path></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-end z-50">
      <div className="w-96 bg-[#161B22] h-full p-6 shadow-2xl flex flex-col animate-slide-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
          </button>
        </div>
        
        <div className="space-y-6 flex-1">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-200">API Keys</h3>
            <APIKeyInput label="OpenAI API Key" />
            <APIKeyInput label="Gemini API Key" />
            <APIKeyInput label="Claude API Key" />
            <APIKeyInput label="Mistral API Key" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-200">Preferences</h3>
            <label className="block text-sm font-medium text-gray-400 mb-1">Provider Priority</label>
            <select className="w-full bg-[#2d333a] border border-gray-600 rounded-md p-2 text-gray-200 focus:ring-cyan-500 focus:border-cyan-500">
              <option>OpenAI &gt; Gemini &gt; Claude</option>
              <option>Gemini &gt; OpenAI &gt; Claude</option>
              <option>Claude &gt; Gemini &gt; OpenAI</option>
            </select>
          </div>
        </div>

        <button className="w-full bg-cyan-600 text-white py-2.5 rounded-md hover:bg-cyan-500 transition-colors mt-6">
          Save Changes
        </button>
      </div>
      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default SettingsPanel;
