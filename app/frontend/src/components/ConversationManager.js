import React, { useState, useEffect } from 'react';
import { Plus, MessageSquare, Trash2 } from 'lucide-react';

export const ConversationManager = ({ onConversationSelect, currentConversationId }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadConversations = async () => {
    setLoading(true);
    // TODO: Implement API call in this component
    // Example structure:
    // const response = await fetch('/api/conversations');
    // const data = await response.json();
    // setConversations(data.conversations || []);
    setConversations([]); // Placeholder
    setLoading(false);
  };

  const createNewConversation = async () => {
    // TODO: Implement API call in this component
    // Example:
    // await fetch('/api/conversations', { method: 'POST' });
    // await loadConversations();
    console.log('Create new conversation');
  };

  const deleteConversation = async (conversationId) => {
    // TODO: Implement API call in this component
    // Example:
    // await fetch(`/api/conversations/${conversationId}`, { method: 'DELETE' });
    // await loadConversations();
    
    // If we deleted the current conversation, select none
    if (conversationId === currentConversationId) {
      onConversationSelect(null);
    }
    console.log('Delete conversation:', conversationId);
  };

  useEffect(() => {
    loadConversations();
  }, []);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700">Conversations</h3>
        <button
          onClick={createNewConversation}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Create New Conversation"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Loading conversations...</div>
      ) : (
        <div className="space-y-2">
          {conversations.length === 0 ? (
            <div className="text-sm text-gray-500 text-center py-4">
              No conversations yet.
              <br />
              Create one to get started!
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                  conversation.id === currentConversationId
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => onConversationSelect(conversation.id)}
              >
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <MessageSquare className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {conversation.title || `Conversation ${conversation.id.substring(0, 8)}`}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(conversation.created_at || Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversation(conversation.id);
                  }}
                  className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                  title="Delete Conversation"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ConversationManager;
