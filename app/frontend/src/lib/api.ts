import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const chatAPI = {
  sendMessage: async (message: string, conversationId?: string) => {
    const response = await api.post('/v2/completion', {
      messages: [{ role: 'user', content: message }],
      conversation_id: conversationId,
    });
    return response.data;
  },

  uploadDocument: async (file: File, onUploadProgress?: (progress: number) => void) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/v2/ingest/files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onUploadProgress) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onUploadProgress(progress);
        }
      },
    });
    return response.data;
  },

  getDocuments: async () => {
    const response = await api.get('/v2/documents');
    return response.data;
  },

  deleteDocument: async (documentId: string) => {
    const response = await api.delete(`/v2/documents/${documentId}`);
    return response.data;
  },

  searchDocuments: async (query: string) => {
    const response = await api.post('/v2/search', {
      query,
    });
    return response.data;
  },
};

export default api;
