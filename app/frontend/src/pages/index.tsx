import React, { useState, useRef, useEffect } from 'react';
import { MessageComponent } from '@/components/MessageComponent';
import { TypingIndicator } from '@/components/TypingIndicator';
import { ChatInput } from '@/components/ChatInput';
import { DocumentUpload, DocumentList } from '@/components/DocumentManager';
import { Message, Document } from '@/types';
import { chatAPI } from '@/lib/api';
import { FileText, MessageSquare } from 'lucide-react';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'documents'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [conversationId, setConversationId] = useState<string>();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await chatAPI.sendMessage(content, conversationId);
      
      if (response.results && response.results.length > 0) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response.results[0].completion.choices[0].message.content,
          role: 'assistant',
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, assistantMessage]);
        
        if (response.results[0].completion.id && !conversationId) {
          setConversationId(response.results[0].completion.id);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error while processing your message. Please make sure the R2R backend is running.',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleDocumentUploaded = (document: Document) => {
    setDocuments(prev => [...prev, document]);
    
    // Add a message to inform the user about the document upload
    const uploadMessage: Message = {
      id: Date.now().toString(),
      content: `Document "${document.name}" has been uploaded successfully. You can now ask questions about it.`,
      role: 'assistant',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, uploadMessage]);
  };

  const handleDocumentDelete = async (documentId: string) => {
    try {
      await chatAPI.deleteDocument(documentId);
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  // Add welcome message on first load
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        content: 'Hello! I\'m your R2R AI assistant. You can upload documents and ask questions about them. How can I help you today?',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">R2R Chatbot</h1>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('documents')}
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              activeTab === 'documents'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Documents
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              activeTab === 'chat'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <MessageSquare className="w-4 h-4 inline mr-2" />
            Chat Info
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto">
          {activeTab === 'documents' && (
            <div>
              <DocumentUpload onDocumentUploaded={handleDocumentUploaded} />
              <DocumentList
                documents={documents}
                onDocumentDelete={handleDocumentDelete}
              />
            </div>
          )}
          {activeTab === 'chat' && (
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Conversation Stats
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Messages: {messages.length}</p>
                    <p>Documents: {documents.length}</p>
                    <p>Status: {isTyping ? 'Typing...' : 'Ready'}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Features
                  </h3>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Upload documents (PDF, DOC, TXT, MD)</li>
                    <li>• Ask questions about your documents</li>
                    <li>• Get AI-powered responses</li>
                    <li>• Search through document content</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
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
