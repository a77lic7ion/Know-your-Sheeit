
import React, { useState } from 'react';

interface DocumentReviewPanelProps {
  onClose: () => void;
}

const DocumentReviewPanel: React.FC<DocumentReviewPanelProps> = ({ onClose }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setUploadedFile(event.target.files[0]);
    }
  };

  const mockDocumentText = `This agreement is made and entered into on this 15th day of October, 2023, by and between ACME Corporation, hereinafter referred to as the "Company," and John Doe, hereinafter referred to as the "Consultant."

WHEREAS, the Company is in need of consulting services in the field of software development; and

WHEREAS, the Consultant has the expertise and qualifications to provide such services;

NOW, THEREFORE, in consideration of the mutual covenants and promises herein contained, the parties agree as follows:

1. Services. The Consultant shall provide the Company with consulting services as requested by the Company from time to time.

2. Term. This Agreement shall commence on the date first written above and shall continue until terminated by either party upon thirty (30) days written notice.
`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#161B22] rounded-lg shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh]">
        <header className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold">Document Review</h2>
          <div className="flex items-center gap-4">
            <button className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-500 text-sm">Generate Legal Response</button>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            </button>
          </div>
        </header>

        <div className="p-6 overflow-y-auto">
          {!uploadedFile ? (
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-10 text-center">
              <p className="mb-2 text-gray-400">Drag and drop your files here or click to upload</p>
              <p className="text-xs text-gray-500 mb-4">PDF, DOCX, and image files are supported.</p>
              <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} />
              <label htmlFor="file-upload" className="cursor-pointer bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 text-sm">Upload File</label>
            </div>
          ) : (
            <div>
              <h3 className="font-semibold text-white mb-4">Uploaded Document: {uploadedFile.name}</h3>
              <div className="bg-[#0D1117] p-4 rounded-md border border-gray-700 max-h-96 overflow-y-auto">
                <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                  <span className="bg-yellow-500/20 px-1 rounded">
                    1. Services. The Consultant shall provide the Company with consulting services as requested by the Company from time to time.
                  </span>
                  {mockDocumentText.substring(mockDocumentText.indexOf("\n\n2."))}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentReviewPanel;
