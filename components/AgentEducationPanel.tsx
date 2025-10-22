
import React, { useState } from 'react';
import { AGENTS } from '../constants';

const AgentEducationPanel: React.FC = () => {
  const [uploadedItems, setUploadedItems] = useState([
    { name: 'contract_v1.pdf', status: 'Processing...' },
    { name: 'lexisnexis.com/case-law', status: 'Pending Review' },
  ]);

  const mockJsonResponse = {
    "document_id": "contract_v1.pdf",
    "entities": [
      {"type": "PARTY", "text": "Innovate Corp", "confidence": 0.98},
      {"type": "PARTY", "text": "Synergy Inc", "confidence": 0.97},
      {"type": "EFFECTIVE_DATE", "text": "October 26, 2023", "confidence": 0.99},
      {"type": "JURISDICTION", "text": "State of Delaware", "confidence": 0.95}
    ],
    "clauses": [
      {
        "title": "Confidentiality",
        "summary": "Both parties agree to maintain the confidentiality of all proprietary information shared during the term of this agreement.",
        "keywords": ["confidentiality", "proprietary", "non-disclosure"]
      }
    ],
    "status": "pending_review"
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
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-10 text-center">
                <p className="mb-2">Drag and drop files here or click to browse.</p>
                <button className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-500 text-sm">Browse Files</button>
              </div>
            </div>

            <div className="bg-[#161B22] border border-gray-700 rounded-lg p-6">
                <h3 className="font-semibold text-white mb-4">Enter a URL</h3>
                <div className="flex gap-2">
                    <input type="text" placeholder="https://example.com/legal-document" className="flex-grow bg-[#21262D] border border-gray-600 rounded-md p-2.5 focus:ring-cyan-500 focus:border-cyan-500" />
                    <button className="bg-cyan-600 text-white px-6 py-2 rounded-md hover:bg-cyan-500">Submit</button>
                </div>
            </div>

            <div className="bg-[#161B22] border border-gray-700 rounded-lg p-6">
                <h3 className="font-semibold text-white mb-4">Uploaded Items</h3>
                <ul className="space-y-3">
                  {uploadedItems.map((item, index) => (
                    <li key={index} className="flex items-center justify-between bg-[#21262D] p-3 rounded-md">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-yellow-400 mr-4">{item.status}</span>
                        <button className="text-gray-500 hover:text-white"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd"></path></svg></button>
                      </div>
                    </li>
                  ))}
                </ul>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-[#161B22] border border-gray-700 rounded-lg p-6 h-full flex flex-col">
              <h3 className="font-semibold text-white mb-4">Generated Knowledge Base Preview</h3>
              <div className="bg-[#0D1117] rounded-md p-4 flex-1 overflow-auto">
                <pre className="text-xs text-green-300 whitespace-pre-wrap">{JSON.stringify(mockJsonResponse, null, 2)}</pre>
              </div>
              <div className="flex gap-4 mt-6">
                <button className="flex-1 bg-green-600 text-white py-2.5 rounded-md hover:bg-green-500">Approve Knowledge Base</button>
                <button className="flex-1 bg-red-600 text-white py-2.5 rounded-md hover:bg-red-500">Reject Knowledge Base</button>
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
