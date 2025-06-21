# RAG Document Processing Application

A full-stack Retrieval-Augmented Generation (RAG) application that enables users to upload documents and ask questions about their content using AI-powered document processing.

## Features

- **Document Upload**: Support for PDF, DOCX, and TXT file formats
- **Document Processing**: Automatic text extraction and parsing
- **Question Answering**: Ask questions about uploaded documents
- **Modern UI**: Clean, responsive interface built with Next.js
- **Real-time Processing**: Live feedback during document upload and processing

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **Multer** - File upload middleware
- **pdf-parse** - PDF text extraction
- **mammoth** - DOCX text extraction

## Project Structure

```
RAG/
├── client/                 # Next.js frontend application
│   ├── app/               # App router pages and layouts
│   ├── components/        # Reusable UI components
│   └── package.json       # Frontend dependencies
├── server/                # Express.js backend application
│   ├── controllers/       # Request handlers
│   ├── routes/           # API route definitions
│   ├── services/         # Business logic and utilities
│   ├── uploads/          # File upload directory
│   └── package.json      # Backend dependencies
└── README.md             # Project documentation
```

## Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd RAG
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   pnpm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   pnpm install
   ```

## Running the Application

### Development Mode

1. **Start the backend server**
   ```bash
   cd server
   pnpm dev
   ```
   The server will run on `http://localhost:3001`

2. **Start the frontend application**
   ```bash
   cd client
   pnpm dev
   ```
   The client will run on `http://localhost:3000`

### Production Mode

1. **Build and start the backend**
   ```bash
   cd server
   pnpm start
   ```

2. **Build and start the frontend**
   ```bash
   cd client
   pnpm build
   pnpm start
   ```

## API Endpoints

### Document Upload
- **POST** `/api/upload`
  - Upload and process documents
  - Accepts: PDF, DOCX, TXT files
  - Returns: Processing status and document ID

### Question Answering
- **POST** `/api/ask`
  - Ask questions about uploaded documents
  - Body: `{ question: string, docId: string }`
  - Returns: AI-generated answer

## Usage

1. **Upload a Document**
   - Navigate to the application
   - Click "Choose File" or drag and drop a document
   - Supported formats: PDF, DOCX, TXT
   - Wait for processing to complete

2. **Ask Questions**
   - Once processing is complete, enter your question
   - Click "Ask" to get an AI-powered answer
   - The system will analyze the document content to provide relevant responses

## File Upload Limits

- Maximum file size: 10MB
- Supported formats: PDF, DOCX, TXT
- Multiple files can be uploaded sequentially

## Troubleshooting

### Common Issues

1. **404 Errors**
   - Ensure backend server is running on port 3001
   - Check API endpoint URLs in frontend code

2. **File Upload Failures**
   - Verify file format is supported
   - Check file size limits
   - Ensure uploads directory exists in server folder

3. **PDF Processing Issues**
   - Some PDFs may require additional processing time
   - Ensure pdf-parse dependencies are properly installed

### Development Tips

- Use `nodemon` for automatic server restarts during development
- Check browser console for frontend errors
- Monitor server logs for backend issues
- Ensure CORS is properly configured for cross-origin requests

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please check the troubleshooting section or create an issue in the repository.