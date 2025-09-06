const express = require('express');
const RAGAgent = require('./agent');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Initialize RAG Agent
const agent = new RAGAgent();

// Ingest documents endpoint
app.post('/ingest', async (req, res) => {
  try {
    const { file_path, metadata } = req.body;
    const result = await agent.ingestDocuments(file_path, metadata);
    res.json({ success: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete document endpoint
app.post('/delete', async (req, res) => {
  try {
    const { document_id } = req.body;
    const result = await agent.deleteDocument(document_id);
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
    const { query } = req.body;
    await agent.ragQuery(query);
    res.json({ success: true, message: 'Query executed' });
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
    const result = await agent.listConversation();
    res.json({ success: true, conversations: result.results || [] });
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
    await agent.getConversationDetails(conversation_id);
    res.json({ success: true, message: 'Conversation details retrieved' });
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
