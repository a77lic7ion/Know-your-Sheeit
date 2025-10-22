import React, { useState, useRef } from 'react';
import { AGENTS } from '../constants';
import { processUrlForRAG } from '../services/geminiService';

type UploadStatus = 'Processing...' | 'Pending Review' | 'Completed' | 'Failed' | 'Uploaded';

interface UploadedItem {
  id: number;
  name: string;
  status: UploadStatus;
  type: 'url' | 'file';
}

const AgentEducationPanel: React.FC = () => {
  const [uploadedItems, setUploadedItems] = useState<UploadedItem[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [knowledgeBasePreview, setKnowledgeBasePreview] = useState<object | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlSubmit = async () => {
    if (!urlInput.trim() || isProcessing) return;

    setIsProcessing(true);
    setError(null);
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
      const result = await processUrlForRAG(submittedUrl);
      setKnowledgeBasePreview(result);
      setUploadedItems(prev =>
        prev.map(item =>
          item.id === newItem.id ? { ...item, status: 'Completed' } : item
        )
      );
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to process ${submittedUrl}.`);
      setKnowledgeBasePreview({ error: errorMessage });
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
        id: Date.now() + Math.random(), // Add random to avoid collision in loops
        name: file.name,
        status: 'Uploaded',
        type: 'file',
      }));
      setUploadedItems(prev => [...newItems, ...prev]);
      // Reset file input value to allow re-uploading the same file
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
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

  return (
    <div className="flex h-full bg-[#0D1117] text-gray-300 p-8">
      <div className="flex-1 max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white">Agent Education</h1>
          <p className="text-gray-400 mt-1">Select an agent to train, upload documents, and manage their knowledge base.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <label htmlFor="agent-select" className="block text-sm font-medium mb-2">Select an Agent to Train</label>
              <select id="agent-select" className="w-full bg-[#21262D] border border-gray-600 rounded-md p-2.5 focus:ring-cyan-500 focus:border-cyan-500">
                {AGENTS.map(agent => <option key={agent.id}>{agent.name}</option>)}
              </select>
            </div>

            <div className="bg-[#161B22] border border-gray-700 rounded-lg p-6">
              <h3 className="font-semibold text-white mb-4">Upload Documents</h3>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                multiple 
                accept=".pdf,.doc,.docx,.txt"
              />
              <div 
                className="border-2 border-dashed border-gray-600 rounded-lg p-10 text-center cursor-pointer hover:border-cyan-500 transition-colors"
                onClick={handleBrowseClick}
              >
                <p className="mb-2">Drag and drop files here or click to browse.</p>
                <button 
                    type="button" 
                    onClick={(e) => { e.stopPropagation(); handleBrowseClick(); }}
                    className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-500 text-sm"
                >
                    Browse Files
                </button>
              </div>
            </div>

            <div className="bg-[#161B22] border border-gray-700 rounded-lg p-6">
                <h3 className="font-semibold text-white mb-4">Enter a URL</h3>
                <div className="flex gap-2">
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
                        className="bg-cyan-600 text-white px-6 py-2 rounded-md hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center w-28"
                        onClick={handleUrlSubmit}
                        disabled={isProcessing || !urlInput.trim()}
                    >
                      {isProcessing ? (
                         <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                      ) : (
                        'Submit'
                      )}
                    </button>
                </div>
            </div>

            <div className="bg-[#161B22] border border-gray-700 rounded-lg p-6">
                <h3 className="font-semibold text-white mb-4">Uploaded Items</h3>
                {uploadedItems.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                      <thead className="text-xs text-gray-400 uppercase bg-[#21262D]">
                        <tr>
                          <th scope="col" className="px-4 py-3">Name</th>
                          <th scope="col" className="px-4 py-3">Status</th>
                          <th scope="col" className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {uploadedItems.map((item) => (
                          <tr key={item.id} className="border-b border-gray-700 hover:bg-[#21262D]">
                            <th scope="row" className="px-4 py-4 font-medium text-white whitespace-nowrap flex items-center max-w-xs">
                              {item.type === 'url' ? (
                                <svg className="w-5 h-5 mr-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                              ) : (
                                <svg className="w-5 h-5 mr-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                              )}
                              <span className="truncate" title={item.name}>{item.name}</span>
                            </th>
                            <td className="px-4 py-4">
                              <div className="flex items-center">
                                {item.status === 'Processing...' && (
                                  <svg className="animate-spin h-4 w-4 text-yellow-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                )}
                                <span className={`font-medium ${getStatusColor(item.status)}`}>{item.status}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <button className="text-gray-500 hover:text-red-500 transition-colors" title="Delete">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd"></path></svg>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-4 border-2 border-dashed border-gray-700 rounded-lg">
                    <p>No items uploaded yet.</p>
                  </div>
                )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-[#161B22] border border-gray-700 rounded-lg p-6 h-full flex flex-col">
              <h3 className="font-semibold text-white mb-4">Generated Knowledge Base Preview</h3>
              <div className="bg-[#0D1117] rounded-md p-4 flex-1 overflow-auto">
                {knowledgeBasePreview ? (
                  <pre className={`text-xs whitespace-pre-wrap ${error ? 'text-red-400' : 'text-green-300'}`}>{JSON.stringify(knowledgeBasePreview, null, 2)}</pre>
                ) : (
                   <div className="flex items-center justify-center h-full text-gray-500">
                    <p>{isProcessing ? 'Generating knowledge base...' : 'Submit a URL to see the generated knowledge base.'}</p>
                   </div>
                )}
              </div>
              <div className="flex gap-4 mt-6">
                <button className="flex-1 bg-green-600 text-white py-2.5 rounded-md hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed" disabled={!knowledgeBasePreview || !!error}>Approve Knowledge Base</button>
                <button className="flex-1 bg-red-600 text-white py-2.5 rounded-md hover:bg-red-500 disabled:bg-gray-600 disabled:cursor-not-allowed" disabled={!knowledgeBasePreview}>Reject Knowledge Base</button>
              </div>
            </div>
             <div className="bg-[#161B22] border border-gray-700 rounded-lg p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-white">Weekly Update Scheduler</h3>
                    <p className="text-sm text-gray-400">Enable automatic weekly updates for this agent's knowledge base.</p>
                  </div>
                  <label htmlFor="toggle" className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input type="checkbox" id="toggle" className="sr-only" />
                      <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                      <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                    </div>
                  </label>
                </div>
            </div>
          </div>
        </div>
      </div>
       <style>{`
          input:checked ~ .dot {
            transform: translateX(100%);
            background-color: #34D399;
          }
           input:checked ~ .block {
            background-color: #10B981;
           }
        `}</style>
    </div>
  );
};

export default AgentEducationPanel;