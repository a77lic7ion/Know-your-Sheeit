import React, { useState, useRef, useEffect } from 'react';
import { AGENTS } from '../constants';
import { processUrlForRAG, processFileForRAG } from '../services/geminiService';
import * as knowledgeBaseService from '../services/knowledgeBaseService';
import type { User, KnowledgeBase, KnowledgeEntry, KnowledgeEntryContent } from '../types';

type ProcessingStatus = 'Processing...' | 'Completed' | 'Failed';

interface ProcessedItem {
  id: number;
  name: string;
  status: ProcessingStatus;
  type: 'url' | 'file';
}

interface AgentEducationPanelProps {
  currentUser: User | null;
  onBackToChat: () => void;
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


const AgentEducationPanel: React.FC<AgentEducationPanelProps> = ({ currentUser, onBackToChat }) => {
  const [processedItem, setProcessedItem] = useState<ProcessedItem | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [knowledgeBasePreview, setKnowledgeBasePreview] = useState<KnowledgeEntryContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string>(AGENTS[0].id);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBase>({});
  const [isLoadingKB, setIsLoadingKB] = useState(true);

  useEffect(() => {
    const fetchKB = async () => {
        setIsLoadingKB(true);
        const kb = await knowledgeBaseService.getKnowledgeBase();
        setKnowledgeBase(kb);
        setIsLoadingKB(false);
    }
    fetchKB();
  }, []);

  const startProcessing = (item: ProcessedItem) => {
    setIsProcessing(true);
    setError(null);
    setSuccessMessage(null);
    setKnowledgeBasePreview(null);
    setProcessedItem(item);
  };
  
  const handleApiResponse = (result: KnowledgeEntryContent, item: ProcessedItem) => {
    setKnowledgeBasePreview(result);
    setProcessedItem({ ...item, status: 'Completed' });
  };
  
  const handleApiError = (e: unknown, item: ProcessedItem) => {
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    setError(`Failed to process ${item.name}.`);
    setKnowledgeBasePreview({ error: errorMessage } as any);
    setProcessedItem({ ...item, status: 'Failed' });
  };

  const processSource = async (
    source: string, 
    type: 'url' | 'file', 
    apiCall: (source: string, apiKey: string) => Promise<object>
  ) => {
    const geminiApiKey = currentUser?.apiKeys?.gemini;
    if (!geminiApiKey) {
      setError("Gemini API key not found. Please add it in Settings.");
      return;
    }
    
    const newItem: ProcessedItem = { id: Date.now(), name: source, status: 'Processing...', type };
    startProcessing(newItem);
    if (type === 'url') setUrlInput('');

    try {
      const result = await apiCall(source, geminiApiKey) as KnowledgeEntryContent;
      handleApiResponse(result, newItem);
    } catch (e) {
      handleApiError(e, newItem);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim() || isProcessing) return;
    processSource(urlInput, 'url', processUrlForRAG);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && !isProcessing) {
        processSource(file.name, 'file', processFileForRAG);
    }
    // Reset file input to allow uploading the same file again
    event.target.value = '';
  };
  
  const handleApprove = async () => {
    if (!knowledgeBasePreview || !currentUser || !processedItem) return;
    
    const newEntry: KnowledgeEntry = {
        id: `kn-${Date.now()}`,
        agentId: selectedAgentId,
        url: processedItem.type === 'url' ? processedItem.name : `file://${processedItem.name}`,
        content: knowledgeBasePreview,
        approvedBy: currentUser.email,
        approvedAt: new Date().toISOString()
    };
    
    await knowledgeBaseService.addKnowledgeEntry(newEntry);
    
    // Update local state directly instead of refetching
    setKnowledgeBase(prevKB => {
        const updatedAgentEntries = [...(prevKB[selectedAgentId] || [])];
        const existingEntryIndex = updatedAgentEntries.findIndex(entry => entry.url === newEntry.url);

        if (existingEntryIndex !== -1) {
            updatedAgentEntries[existingEntryIndex] = newEntry;
        } else {
            updatedAgentEntries.push(newEntry);
        }
        
        return {
            ...prevKB,
            [selectedAgentId]: updatedAgentEntries
        };
    });

    setKnowledgeBasePreview(null);
    setProcessedItem(null);
    setSuccessMessage("Knowledge base approved and added successfully!");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleReject = () => {
    setKnowledgeBasePreview(null);
    setProcessedItem(null);
  };

  const agentKnowledge = knowledgeBase[selectedAgentId] || [];

  return (
    <div className="flex h-full bg-[#0D1117] text-gray-300 p-4 sm:p-8 overflow-y-auto">
      <div className="flex-1 max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Agent Education</h1>
            <p className="text-gray-400 mt-1">Select an agent to train, upload documents, and manage their shared knowledge base.</p>
          </div>
          <button onClick={onBackToChat} className="text-sm bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Chat
          </button>
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

            <div className="bg-[#161B22] border border-gray-700 rounded-lg p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-white mb-2">Enter a URL to Process</h3>
                <div className="flex flex-col sm:flex-row gap-2">
                    <input type="text" placeholder="https://example.com/legal-document" className="flex-grow bg-[#21262D] border border-gray-600 rounded-md p-2.5 focus:ring-cyan-500 focus:border-cyan-500 disabled:opacity-50" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()} disabled={isProcessing}/>
                    <button className="bg-cyan-600 text-white px-6 py-2 rounded-md hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center sm:w-28" onClick={handleUrlSubmit} disabled={isProcessing || !urlInput.trim()}>
                      {isProcessing && processedItem?.type === 'url' ? <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : 'Process'}
                    </button>
                </div>
              </div>
              <div className="flex items-center text-gray-500"><hr className="flex-grow border-gray-600"/><span className="px-2">OR</span><hr className="flex-grow border-gray-600"/></div>
              <div>
                <h3 className="font-semibold text-white mb-2">Upload a Document</h3>
                 <label htmlFor="file-upload" className="flex justify-center w-full h-24 px-4 transition bg-[#21262D] border-2 border-gray-600 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed">
                    <span className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                        <span className="font-medium text-gray-500">Drop files to Attach, or <span className="text-cyan-500 underline">browse</span></span>
                    </span>
                    <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} disabled={isProcessing} accept=".pdf,.doc,.docx,.txt" />
                </label>
              </div>
            </div>
            
             <div className="bg-[#161B22] border border-gray-700 rounded-lg p-6">
              <h3 className="font-semibold text-white mb-4">Approved Knowledge Sources for {AGENTS.find(a=>a.id === selectedAgentId)?.name}</h3>
              {isLoadingKB ? (
                <div className="text-center text-gray-500 py-4">Loading knowledge base...</div>
              ) : agentKnowledge.length > 0 ? (
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
                {processedItem?.status === 'Processing...' ? (
                  <div className="flex items-center justify-center h-full text-gray-500 text-center flex-col">
                    <svg className="animate-spin h-8 w-8 text-cyan-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <p>Generating knowledge base from <br/><span className="font-mono text-xs break-all">{processedItem.name}</span>...</p>
                  </div>
                ) : knowledgeBasePreview ? (
                  <pre className={`text-xs whitespace-pre-wrap ${error ? 'text-red-400' : 'text-green-300'}`}>{JSON.stringify(knowledgeBasePreview, null, 2)}</pre>
                ) : (
                   <div className="flex items-center justify-center h-full text-gray-500 text-center">
                    <p>Process a URL or upload a file to see the generated knowledge base preview.</p>
                   </div>
                )}
              </div>
              {processedItem && processedItem.status !== 'Processing...' && (
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentEducationPanel;