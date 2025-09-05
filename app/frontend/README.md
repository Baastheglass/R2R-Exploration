# R2R Chatbot Frontend

A Next.js frontend for the R2R (RAG to Riches) chatbot that allows users to upload documents and ask questions about them.

## Features

- **Document Upload**: Drag and drop or browse to upload PDF, DOC, DOCX, TXT, and MD files
- **Interactive Chat**: Real-time chat interface with typing indicators
- **Document Management**: View and manage uploaded documents
- **Responsive Design**: Clean, modern UI with Tailwind CSS
- **JavaScript**: Pure JavaScript implementation with Next.js

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- R2R backend running on `http://localhost:8000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file (optional):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── ChatInput.js    # Chat message input component
│   ├── DocumentManager.js # Document upload and management
│   ├── MessageComponent.js # Individual message display
│   └── TypingIndicator.js # Typing animation
├── lib/
│   └── api.js          # API client for R2R backend
├── pages/              # Next.js pages
│   ├── _app.js         # App wrapper
│   ├── _document.js    # HTML document structure
│   └── index.js        # Main chat interface
├── styles/
│   └── globals.css     # Global styles with Tailwind
└── types/
    └── index.js        # JavaScript type definitions/constants
```

## API Integration

The frontend connects to the R2R backend API with the following endpoints:

- `POST /v2/completion` - Send chat messages
- `POST /v2/ingest/files` - Upload documents
- `GET /v2/documents` - List documents
- `DELETE /v2/documents/{id}` - Delete documents
- `POST /v2/search` - Search documents

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Customization

To customize the API base URL, set the `NEXT_PUBLIC_API_URL` environment variable in `.env.local`.

## Deployment

The app can be deployed on any platform that supports Next.js:

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm run start
```

Or deploy to Vercel, Netlify, or other platforms that support Next.js applications.

## Troubleshooting

- Ensure the R2R backend is running before starting the frontend
- Check that the API URL is correctly configured
- For CORS issues, ensure the R2R backend allows requests from your frontend domain
