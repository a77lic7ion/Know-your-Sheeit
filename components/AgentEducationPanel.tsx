import React, { useState, useRef, useEffect } from 'react';
import { AGENTS } from '../constants';
import { processUrlForRAG } from '../services/geminiService';
import * as knowledgeBaseService from '../services/knowledgeBaseService';
import type { User, KnowledgeBase, KnowledgeEntry, KnowledgeEntryContent } from '../types';

type UploadStatus = 'Processing...' | 'Pending Review' | 'Completed' | 'Failed' | 'Uploaded';

interface UploadedItem {
  id: number;
  name: string;
  status: UploadStatus;
  type: 'url' | 'file';
}

interface AgentEducationPanelProps {
  currentUser: User | null;
}

const KnowledgeBaseItem: React.FC<{ entry: KnowledgeEntry }> = ({ entry }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-[#0D1117] p-4 rounded-lg">
            <div className="flex justify-between items-start">
                <div>
                    <a href={entry.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-cyan-400 hover:underline break-all">{entry.url}</a>
                    <p className="text-xs text-gray-500 mt-1">
                        Approved by {entry.approvedBy} on {new Date(entry.approvedAt).toLocaleDateString()}
                    </p>
                </div>
                <button onClick={() => setIsExpanded(!isExpanded)} className="text-gray-400 hover:text-white ml-2 flex-shrink-0">
                   {isExpanded ? (
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg>
                   ) : (
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                   )}
                </button>
            </div>
            {isExpanded && (
                <div className="mt-3 pt-3 border-t border-gray-700">
                    <pre className="text-xs whitespace-pre-wrap text-gray-300 bg-black p-2 rounded-md">
                        {JSON.stringify(entry.content, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};


const AgentEducationPanel: React.FC<AgentEducationPanelProps> = ({ currentUser }) => {
  const [uploadedItems, setUploadedItems] = useState<UploadedItem[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [knowledgeBasePreview, setKnowledgeBasePreview] = useState<KnowledgeEntryContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string>(AGENTS[0].id);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBase>(knowledgeBaseService.getKnowledgeBase());

  useEffect(() => {
    setKnowledgeBase(knowledgeBaseService.getKnowledgeBase());
  }, []);

  const handleUrlSubmit = async () => {
    if (!urlInput.trim() || isProcessing) return;

    const geminiApiKey = currentUser?.apiKeys?.gemini;
    if (!geminiApiKey) {
      setError("Gemini API key not found. Please add it in the Settings panel before training an agent.");
      setKnowledgeBasePreview({ error: "Gemini API key not found." } as any);
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    setSuccessMessage(null);
    setKnowledgeBasePreview(null);

    const newItem: UploadedItem = {
      id: Date.now(),
      name: urlInput,
      status: 'Processing...',
      type: 'url',
    };
    
    setUploadedItems(prev => [newItem, ...prev]);
    const submittedUrl = urlInput;
    setUrlInput('');

    try {
      const result = await processUrlForRAG(submittedUrl, geminiApiKey) as KnowledgeEntryContent;
      setKnowledgeBasePreview(result);
      setUploadedItems(prev =>
        prev.map(item =>
          item.id === newItem.id ? { ...item, status: 'Completed' } : item
        )
      );
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to process ${submittedUrl}.`);
      setKnowledgeBasePreview({ error: errorMessage } as any);
      setUploadedItems(prev =>
        prev.map(item =>
          item.id === newItem.id ? { ...item, status: 'Failed' } : item
        )
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const newItems: UploadedItem[] = files.map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        status: 'Uploaded',
        type: 'file',
      }));
      setUploadedItems(prev => [...newItems, ...prev]);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleApprove = () => {
    if (!knowledgeBasePreview || !currentUser) return;
    const lastProcessedItem = uploadedItems.find(item => item.status === 'Completed');
    if (!lastProcessedItem) {
        setError("Could not find the original source URL for this knowledge.");
        return;
    }

    const newEntry: KnowledgeEntry = {
        id: `kn-${Date.now()}`,
        agentId: selectedAgentId,
        url: lastProcessedItem.name,
        content: knowledgeBasePreview,
        approvedBy: currentUser.email,
        approvedAt: new Date().toISOString()
    };
    
    knowledgeBaseService.addKnowledgeEntry(newEntry);
    setKnowledgeBase(knowledgeBaseService.getKnowledgeBase()); // Refresh state
    setKnowledgeBasePreview(null);
    setUploadedItems(prev => prev.filter(item => item.id !== lastProcessedItem.id));
    setSuccessMessage("Knowledge base approved and added successfully!");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleReject = () => {
    setKnowledgeBasePreview(null);
    const lastProcessedItem = uploadedItems.find(item => item.status === 'Completed');
    if(lastProcessedItem) {
        setUploadedItems(prev => prev.filter(item => item.id !== lastProcessedItem.id));
    }
  };


  const getStatusColor = (status: UploadStatus) => {
    switch (status) {
      case 'Processing...': return 'text-yellow-400';
      case 'Completed': return 'text-green-400';
      case 'Failed': return 'text-red-500';
      case 'Pending Review': return 'text-orange-400';
      case 'Uploaded': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const agentKnowledge = knowledgeBase[selectedAgentId] || [];

  return (
    <div className="flex h-full bg-[#0D1117] text-gray-300 p-4 sm:p-8 overflow-y-auto">
      <div className="flex-1 max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white">Agent Education</h1>
          <p className="text-gray-400 mt-1">Select an agent to train, upload documents, and manage their shared knowledge base.</p>
        </header>

        {successMessage && (
            <div className="bg-green-500/20 border border-green-500 text-green-300 text-sm rounded-lg p-3 mb-6">
                {successMessage}
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <label htmlFor="agent-select" className="block text-sm font-medium mb-2">Select an Agent to Train</label>
              <select 
                id="agent-select" 
                className="w-full bg-[#21262D] border border-gray-600 rounded-md p-2.5 focus:ring-cyan-500 focus:border-cyan-500"
                value={selectedAgentId}
                onChange={(e) => setSelectedAgentId(e.target.value)}
              >
                {AGENTS.map(agent => <option key={agent.id} value={agent.id}>{agent.name}</option>)}
              </select>
            </div>

            <div className="bg-[#161B22] border border-gray-700 rounded-lg p-6">
              <h3 className="font-semibold text-white mb-4">Enter a URL to Process</h3>
              <div className="flex flex-col sm:flex-row gap-2">
                  <input 
                      type="text" 
                      placeholder="https://example.com/legal-document" 
                      className="flex-grow bg-[#21262D] border border-gray-600 rounded-md p-2.5 focus:ring-cyan-500 focus:border-cyan-500 disabled:opacity-50"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                      disabled={isProcessing}
                  />
                  <button 
                      className="bg-cyan-600 text-white px-6 py-2 rounded-md hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center sm:w-28"
                      onClick={handleUrlSubmit}
                      disabled={isProcessing || !urlInput.trim()}
                  >
                    {isProcessing ? (
                       <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                      'Process'
                    )}
                  </button>
              </div>
            </div>
            
             <div className="bg-[#161B22] border border-gray-700 rounded-lg p-6">
              <h3 className="font-semibold text-white mb-4">Approved Knowledge Sources for {AGENTS.find(a=>a.id === selectedAgentId)?.name}</h3>
              {agentKnowledge.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                      {agentKnowledge.map(entry => <KnowledgeBaseItem key={entry.id} entry={entry} />)}
                  </div>
              ) : (
                  <div className="text-center text-gray-500 py-4 border-2 border-dashed border-gray-700 rounded-lg">
                      <p>No knowledge base entries for this agent yet.</p>
                  </div>
              )}
            </div>

          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-[#161B22] border border-gray-700 rounded-lg p-6 h-full flex flex-col min-h-[400px] lg:min-h-0">
              <h3 className="font-semibold text-white mb-4">Generated Knowledge Base Preview</h3>
              <div className="bg-[#0D1117] rounded-md p-4 flex-1 overflow-auto">
                {knowledgeBasePreview ? (
                  <pre className={`text-xs whitespace-pre-wrap ${error ? 'text-red-400' : 'text-green-300'}`}>{JSON.stringify(knowledgeBasePreview, null, 2)}</pre>
                ) : (
                   <div className="flex items-center justify-center h-full text-gray-500 text-center">
                    <p>{isProcessing ? 'Generating knowledge base...' : 'Process a URL to see the generated knowledge base preview.'}</p>
                   </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button 
                  className="flex-1 bg-green-600 text-white py-2.5 rounded-md hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed" 
                  disabled={!knowledgeBasePreview || !!error}
                  onClick={handleApprove}
                >
                  Approve Knowledge Base
                </button>
                <button 
                  className="flex-1 bg-red-600 text-white py-2.5 rounded-md hover:bg-red-500 disabled:bg-gray-600 disabled:cursor-not-allowed" 
                  disabled={!knowledgeBasePreview}
                  onClick={handleReject}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentEducationPanel;