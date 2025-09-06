import React, { useState, useRef, useEffect } from 'react';
import { MessageComponent } from '@/components/MessageComponent';
import { TypingIndicator } from '@/components/TypingIndicator';
import { ChatInput } from '@/components/ChatInput';
import { DocumentUpload, DocumentList } from '@/components/DocumentManager';
import { ConversationManager } from '@/components/ConversationManager';
import { FileText, MessageSquare } from 'lucide-react';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState('conversations');
  const messagesEndRef = useRef(null);
  const [conversationId, setConversationId] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (content) => {
    const userMessage = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // TODO: Implement API call in this component
    // You can add your API logic here
    
    setIsTyping(false);
  };

  const handleDocumentUploaded = (document) => {
    setDocuments(prev => [...prev, document]);
    
    // Add a message to inform the user about the document upload
    const uploadMessage = {
      id: Date.now().toString(),
      content: `Document "${document.name}" has been uploaded successfully. You can now ask questions about it.`,
      role: 'assistant',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, uploadMessage]);
  };

  const handleDocumentDelete = async (documentId) => {
    // TODO: Implement API call in this component
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
  };

  const handleConversationSelect = (newConversationId) => {
    setConversationId(newConversationId);
    setMessages([]); // Clear current messages when switching conversations
    
    if (newConversationId) {
      // TODO: Load conversation details/messages here if needed
      loadConversationMessages(newConversationId);
    }
  };

  const loadConversationMessages = async (convId) => {
    // TODO: Implement API call in this component
    console.log('Loading conversation messages for:', convId);
  };

  // Add welcome message on first load
  useEffect(() => {
    if (messages.length === 0 && !conversationId) {
      const welcomeMessage = {
        id: 'welcome',
        content: 'Hello! I\'m your R2R AI assistant. You can create a new conversation, upload documents, and ask questions about them. How can I help you today?',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [conversationId]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">R2R Chatbot</h1>
          {conversationId && (
            <p className="text-xs text-gray-500 mt-1">
              Active: {conversationId.substring(0, 8)}...
            </p>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('conversations')}
            className={`flex-1 px-3 py-3 text-sm font-medium ${
              activeTab === 'conversations'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <MessageSquare className="w-4 h-4 inline mr-2" />
            Conversations
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`flex-1 px-3 py-3 text-sm font-medium ${
              activeTab === 'documents'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Documents
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto">
          {activeTab === 'conversations' && (
            <ConversationManager
              onConversationSelect={handleConversationSelect}
              currentConversationId={conversationId}
            />
          )}
          {activeTab === 'documents' && (
            <div>
              <DocumentUpload onDocumentUploaded={handleDocumentUploaded} />
              <DocumentList
                documents={documents}
                onDocumentDelete={handleDocumentDelete}
              />
            </div>
          )}
        </div>

        {/* Status Info */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-600 space-y-1">
            <p>Messages: {messages.length}</p>
            <p>Documents: {documents.length}</p>
            <p>Status: {isTyping ? 'Typing...' : 'Ready'}</p>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-auto p-4 scrollbar-hide">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((message) => (
              <MessageComponent key={message.id} message={message} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
      </div>
    </div>
  );
}
