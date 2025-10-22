
import React, { useState, KeyboardEvent } from 'react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isThinking: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isThinking }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (inputValue.trim() && !isThinking) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = [
    "Explain my rights as a tenant",
    "Draft a response",
    "Summarize this clause"
  ];

  return (
    <div className="flex flex-col">
      <div className="flex items-center flex-wrap gap-2 mb-3">
        {suggestions.map((text) => (
            <button key={text} onClick={() => onSendMessage(text)} disabled={isThinking} className="px-3 py-1.5 bg-gray-800 text-gray-300 text-sm rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {text}
            </button>
        ))}
      </div>
      <div className="relative">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your legal question here..."
          className="w-full bg-[#21262D] text-gray-300 rounded-lg p-3 pr-24 border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none resize-none"
          rows={1}
          disabled={isThinking}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
            <button className="text-gray-400 hover:text-white disabled:opacity-50" disabled={isThinking}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
            </button>
            <button onClick={handleSend} disabled={isThinking || !inputValue.trim()} className="bg-cyan-600 text-white p-2 rounded-lg hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
            </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;