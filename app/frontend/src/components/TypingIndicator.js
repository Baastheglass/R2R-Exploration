import React from 'react';

export const TypingIndicator = ({ className = '' }) => {
  return (
    <div className={`chat-message bot-message ${className}`}>
      <div className="flex items-start space-x-2">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
            🤖
          </div>
        </div>
        <div className="flex-1 flex items-center space-x-1">
          <div className="typing-indicator"></div>
          <div className="typing-indicator"></div>
          <div className="typing-indicator"></div>
        </div>
      </div>
    </div>
  );
};
