import React from 'react';
import { Message } from '@/types';

interface MessageComponentProps {
  message: Message;
}

export const MessageComponent: React.FC<MessageComponentProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`chat-message ${isUser ? 'user-message' : 'bot-message'}`}>
      <div className="flex items-start space-x-2">
        <div className="flex-shrink-0">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isUser ? 'bg-blue-700' : 'bg-gray-300'
          }`}>
            {isUser ? '👤' : '🤖'}
          </div>
        </div>
        <div className="flex-1">
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          <p className="text-xs opacity-60 mt-1">
            {message.timestamp.toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};
