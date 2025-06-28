import React from 'react';
import { format } from 'date-fns';

const ChatMessage = ({ message, isOwn }) => {
  if (message.type === 'system') {
    return (
      <div className="flex justify-center">
        <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        {!isOwn && (
          <img
            src={message.user.avatar}
            alt={message.user.username}
            className="w-8 h-8 rounded-full mr-2 mt-1"
          />
        )}
        <div className={`${isOwn ? 'mr-2' : 'ml-2'}`}>
          {!isOwn && (
            <p className="text-sm font-medium text-gray-700 mb-1">
              {message.user.username}
            </p>
          )}
          <div
            className={`px-4 py-2 rounded-lg ${
              isOwn
                ? 'bg-blue-500 text-white rounded-br-none'
                : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
            }`}
          >
            <p className="text-sm">{message.content}</p>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {format(new Date(message.timestamp), 'HH:mm')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage; 