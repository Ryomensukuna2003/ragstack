import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";

export async function parseDoc(file) {
  const ext = file.originalname.split('.').pop().toLowerCase();
  let loader;
  switch (ext) {
    case 'pdf':
      loader = new PDFLoader(file.path);
      break;
    case 'docx':
      loader = new DocxLoader(file.path);
      break;
    case 'txt':
      loader = new TextLoader(file.path);
      break;
    default:
      throw new Error(`Unsupported file type: ${ext}`);
  }

  const docs = await loader.load();
  return docs.map(doc => doc.pageContent).join('\n');
}