const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const RAGAgent = require('./agent');

const app = express();
const port = 3000;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Initialize RAG Agent
const agent = new RAGAgent();

// Store document ID to file path mapping
const documentFileMap = new Map();

// File upload endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const metadata = req.body.metadata ? JSON.parse(req.body.metadata) : null;
    
    const result = await agent.ingestDocuments(filePath, metadata);
    
    // Check if ingestion was successful by looking for documentId (camelCase)
    if (result.documentId) {
      // Store the mapping between document ID and file path for later deletion
      documentFileMap.set(result.documentId, filePath);
      
      res.json({ 
        success: true,
        ...result  // Send only the data from ingestDocuments function
      });
    } else {
      res.status(500).json({ error: result.error || 'Ingestion failed' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete document endpoint
app.post('/delete', async (req, res) => {
  try {
    const { document_id } = req.body;
    
    // Delete from R2R system
    const result = await agent.deleteDocument(document_id);
    
    if (result) {
      // Also delete the physical file if we have the mapping
      const filePath = documentFileMap.get(document_id);
      if (filePath && fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          console.log(`Deleted file: ${filePath}`);
        } catch (fileError) {
          console.error(`Error deleting file ${filePath}:`, fileError);
          // Don't fail the whole operation if file deletion fails
        }
      }
      
      // Remove from our mapping
      documentFileMap.delete(document_id);
    }
    
    res.json({ success: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List documents endpoint
app.post('/list', async (req, res) => {
  try {
    const result = await agent.listDocuments();
    res.json({ documents: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// RAG query endpoint
app.post('/query', async (req, res) => {
  try {
    const { query, conversation_id } = req.body;
    const response = await agent.ragQuery(query, conversation_id);
    res.json({ success: true, response: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create conversation endpoint
app.post('/conversation/create', async (req, res) => {
  try {
    const result = await agent.createConversation();
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List conversations endpoint
app.post('/conversation/list', async (req, res) => {
  try {
    const result = await agent.listConversations();
    res.json({ success: true, conversations: result || [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add message to conversation endpoint
app.post('/conversation/message', async (req, res) => {
  try {
    const { conversation_id, message, role } = req.body;
    await agent.addMessageToConversation(conversation_id, message, role);
    res.json({ success: true, message: 'Message added to conversation' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get conversation details endpoint
app.post('/conversation/details', async (req, res) => {
  try {
    const { conversation_id } = req.body;
    const messages = await agent.getConversationDetails(conversation_id);
    res.json({ success: true, messages: messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete conversation endpoint
app.post('/conversation/delete', async (req, res) => {
  try {
    const { conversation_id } = req.body;
    const result = await agent.deleteConversation(conversation_id);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
