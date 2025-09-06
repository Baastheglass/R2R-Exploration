const { r2rClient } = require("r2r-js");

class RAGAgent {
  constructor() {
    this.client = new r2rClient("http://localhost:7272");
  }
  async ingestDocuments(file_path, metadata = null) {
    let response;
    let ingestionResponse;
    try
    {
      if (metadata) {
            ingestionResponse = await this.client.documents.create({
                file: file_path,
                metadata: metadata
            });
        } else {
            console.log("Ingesting document without metadata...");
            console.log("File path:", file_path);
            ingestionResponse = await this.client.documents.create({
                file: file_path
            });
        }
        console.log("Ingestion Response:", ingestionResponse);
        const documentId = ingestionResponse.results.documentId;
        console.log("Document ID:", documentId);
        response = await this.client.documents.extract({
            id: documentId
        });
        console.log("Extraction Response:", response);
        return ingestionResponse.results;
    }
    catch(error)
    {
        console.error("Error ingesting document:", error);
        return { success: false , error: error.message};
    }
    
  }
  async deleteDocument(document_id)
  {
    let response;
    try
    {
      response = await this.client.documents.delete({
          id: document_id,
      });
      console.log("Deletion Response:", response.results.success);
    }
    catch(error)
    {
      console.error("Error deleting document:", error);
      return false;
    }
    return response.results.success;
  }
  async listDocuments()
  {
    const response = await this.client.documents.list({
        limit: 10,
        offset: 0,
    });
    console.log("List Documents Response:", response.results);
    return response.results;
  }
  async ragQuery(query, conversation_id = null)
  {
    const ragResponse = await this.client.retrieval.agent({
        message: {
            role: "user",
            content: query
        },
        ragTools: ["search_file_descriptions", "search_file_knowledge", "get_file_content"],
        conversationId: conversation_id
    });
    console.log("RAG Response:", ragResponse.results.messages[0].content);
    return ragResponse.results.messages[0].content;
  }
  async createConversation()
  {
    const response = await this.client.conversations.create();
    console.log("Create Conversation Response:", response);
    return response.results;
  }
  async listConversations()
  {
    const response = await this.client.conversations.list();
    console.log("List Conversations Response:", response.results);
    return response.results;
  }
  async addMessageToConversation(conversation_id, message, role)
  {
    const response = await this.client.conversations.addMessage({
        id: conversation_id,
        content: message,
        role: role
    });
    console.log("Add Message Response:", response.results);
    return response.results;
  }
  async getConversationDetails(conversation_id)
  {
    const response = await this.client.conversations.retrieve({
        id: conversation_id,
    });
    let messages = [];
    console.log("Get Conversation Details Response:", response);
    console.log("Messages in Conversation:");
    for (const result of response.results) {
      console.log(result);
      messages.push({message: result.message.content, role: result.message.role});
    }
    console.log("Messages Array:", messages);
    return messages;
  }
  async deleteConversation(conversation_id)
  {
    const response = await this.client.conversations.delete({
        id: conversation_id,
    });
    console.log("Delete Conversation Response:", response);
    return response.results.success;
  }
}

module.exports = RAGAgent;

