
import React, { useState } from 'react';
import type { User } from '../types';

interface SettingsPanelProps {
  onClose: () => void;
  onSave: (keys: { [provider: string]: string }) => Promise<void>;
  user: User;
}

type TestStatus = 'idle' | 'testing' | 'success' | 'error';

const providers = [
  { id: 'gemini', name: 'Gemini', type: 'key' as const },
  { id: 'openai', name: 'OpenAI', type: 'key' as const },
  { id: 'claude', name: 'Claude', type: 'key' as const },
  { id: 'mistral', name: 'Mistral', type: 'key' as const },
  { id: 'ollama', name: 'Ollama', type: 'url' as const },
];

const APIKeyInput: React.FC<{
  provider: { id: string, name: string, type: 'key' | 'url' };
  value: string;
  onChange: (value: string) => void;
}> = ({ provider, value, onChange }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [testStatus, setTestStatus] = useState<TestStatus>('idle');

  const handleTest = () => {
    setTestStatus('testing');
    // Mock API test call
    setTimeout(() => {
      // Simulate success for Ollama or if a key has a reasonable length
      const successCondition = provider.id === 'ollama' ? value.startsWith('http') : value.length > 10;
      setTestStatus(successCondition ? 'success' : 'error');
      setTimeout(() => setTestStatus('idle'), 2000); // Reset status after 2s
    }, 1000);
  };

  const StatusIndicator: React.FC = () => {
    switch (testStatus) {
      case 'testing':
        return <svg className="animate-spin h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
      case 'success':
        return <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>;
      case 'error':
        return <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>;
      default:
        return null;
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-1">
        {provider.name} {provider.type === 'key' ? 'API Key' : 'Base URL'}
      </label>
      <div className="relative flex items-center gap-2">
        <div className="relative w-full">
            <input
            type={provider.type === 'key' && !isVisible ? 'password' : 'text'}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={provider.type === 'key' ? `Enter your ${provider.name} key` : 'http://localhost:11434'}
            className="w-full bg-[#2d333a] border border-gray-600 rounded-md p-2 text-gray-200 focus:ring-cyan-500 focus:border-cyan-500 pr-10"
            />
            {provider.type === 'key' && (
            <button
                type="button"
                onClick={() => setIsVisible(!isVisible)}
                className="absolute inset-y-0 right-0 px-3 text-gray-400 hover:text-white"
            >
                {isVisible ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59"></path></svg>
                            : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>}
            </button>
            )}
        </div>
        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
          <StatusIndicator />
        </div>
        <button
          type="button"
          onClick={handleTest}
          disabled={testStatus === 'testing'}
          className="text-sm bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-3 rounded-md transition-colors disabled:opacity-50 flex-shrink-0"
        >
          Test
        </button>
      </div>
    </div>
  );
};


const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose, onSave, user }) => {
  const [keys, setKeys] = useState(user.apiKeys || {});
  const [isSaving, setIsSaving] = useState(false);

  const handleKeyChange = (providerId: string, value: string) => {
    setKeys(prev => ({ ...prev, [providerId]: value }));
  };

  const handleSaveChanges = async () => {
      setIsSaving(true);
      await onSave(keys);
      setIsSaving(false);
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
        
        <div className="space-y-6 flex-1 overflow-y-auto pr-2">
            <h3 className="text-lg font-medium text-gray-200">API Keys & Endpoints</h3>
            {providers.map(p => (
              <APIKeyInput 
                key={p.id}
                provider={p}
                value={keys[p.id] || ''}
                onChange={(val) => handleKeyChange(p.id, val)}
              />
            ))}
        </div>

        <button 
            onClick={handleSaveChanges} 
            disabled={isSaving}
            className="w-full bg-cyan-600 text-white py-2.5 rounded-md hover:bg-cyan-500 transition-colors mt-6 disabled:bg-gray-600 flex justify-center items-center"
        >
          {isSaving ? <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                   : "Save Changes"
          }
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
