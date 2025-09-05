const { r2rClient } = require("r2r-js");
const client = new r2rClient("http://localhost:7272");

async function main() {

  let results = await client.retrieval.search({
  query: "How to use ABL mobile app?",
});

console.log(results.results.chunkSearchResults);
  // Perform RAG query
//   const ragResponse = await client.rag({
//     query: "What does the file talk about?",
//     rag_generation_config: {
//       model: "openai/gpt-4o-mini",
//       temperature: 0.0,
//       stream: false,
//     },
//   });

//   // Log search results
//   ragResponse.results.search_results.chunk_search_results.forEach(result => {
//     console.log(`Text: ${result.metadata.text.substring(0, 100)}...`);
//     console.log(`Score: ${result.score}`);
//   });

//   // Log completion
//   console.log(ragResponse.results.completion.choices[0].message.content);
}

main();
