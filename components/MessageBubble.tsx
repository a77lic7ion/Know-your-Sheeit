
import React from 'react';
import type { Message } from '../types';
import { MessageSender } from '../types';
import { UserIcon } from '../constants';

interface MessageBubbleProps {
  message: Message;
  agentIcon: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, agentIcon }) => {
  const isUser = message.sender === MessageSender.USER;

  const wrapperClasses = isUser ? "flex justify-end" : "flex justify-start";
  const bubbleClasses = isUser
    ? "bg-gray-700 text-white rounded-lg"
    : "bg-[#21262D] text-gray-300 rounded-lg";
  
  const iconWrapperClasses = isUser ? "ml-3" : "mr-3";
  const iconClasses = isUser 
    ? "w-8 h-8 p-1 bg-gray-600 rounded-full"
    : "w-8 h-8 p-1 bg-gray-700 rounded-full object-cover";

  const content = (
    <>
      {!isUser && (
        <div className={`${iconWrapperClasses} self-start`}>
          <img src={agentIcon} alt="Agent" className={iconClasses} />
        </div>
      )}
      <div className={`max-w-xl px-4 py-3 ${bubbleClasses}`}>
        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
      </div>
      {isUser && (
        <div className={`${iconWrapperClasses} self-start`}>
          <UserIcon className={iconClasses} />
        </div>
      )}
    </>
  );

  return (
    <div className={`flex items-start ${wrapperClasses}`}>
        {content}
    </div>
  );
};

export default MessageBubble;