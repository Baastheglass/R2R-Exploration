const { r2rClient } = require("r2r-js");

class RAGAgent {
  constructor() {
    this.client = new r2rClient("http://localhost:7272");
  }
  async ingestDocuments(file_path, metadata = null) {
    let response;
    if (metadata) {
        response = await this.client.documents.create({
            file: file_path,
            metadata: metadata
        });
    } else {
        console.log("Ingesting document without metadata...");
        console.log("File path:", file_path);
        response = await this.client.documents.create({
            file: file_path
        });
    }
    console.log("Ingestion Response:", response);
    const documentId = response.results.documentId;
    console.log("Document ID:", documentId);
    response = await this.client.documents.extract({
        id: documentId
    });
    console.log("Extraction Response:", response);
  }
  async deleteDocument(document_id)
  {
    let response;
    try
    {
      response = await this.client.documents.delete({
          id: document_id,
      });
      console.log("Deletion Response:", response);
    }
    catch(error)
    {
      console.error("Error deleting document:", error);
      return false;
    }
    if(response.results.success)
      return true
    else
      return false
  }
  async listDocuments()
  {
    const response = await this.client.documents.list({
        limit: 10,
        offset: 0,
    });
    console.log("List Documents Response:", response);
    return response.results;
  }
  async ragQuery(query)
  {
    const response = await this.client.retrieval.search({
      query: query,
    });
    const results = response.results.chunkSearchResults;
    // results.forEach(result => {
    //   console.log(`Text: ${result.metadata.text.substring(0, 100)}...`);
    //   console.log(`Score: ${result.score}`);
    // });
    results.forEach((result, index) => {
      console.log(`\n--- Result ${index + 1} ---`);
      console.log(`Score: ${result.score}`);
      console.log(`Text snippet: ${result.text}...`);
    });
    console.log(`\nTotal results: ${results.length}`);
  }
  async createConversation()
  {
    const response = await this.client.conversations.create();
    console.log("Create Conversation Response:", response);
  }
  async listConversation()
  {
    const response = await this.client.conversations.list();
    console.log("List Conversations Response:", response);
  }
  async addMessageToConversation(conversation_id, message, role)
  {
    const response = await this.client.conversations.addMessage({
        id: conversation_id,
        content: message,
        role: role
    });
    console.log("Add Message Response:", response);
  }
  async getConversationDetails(conversation_id)
  {
    const response = await this.client.conversations.retrieve({
        id: conversation_id,
    });
    console.log("Get Conversation Details Response:", response);
    console.log("Messages in Conversation:");
    for (const result of response.results) {
      console.log(result);
    }
  }
}

agent = new RAGAgent();
//agent.listConversation();
//agent.addMessageToConversation("5a66daec-390d-4483-998d-a4b38318aac7", "I am bungoo", "system");
agent.getConversationDetails("5a66daec-390d-4483-998d-a4b38318aac7");
//module.exports = RAGAgent;

