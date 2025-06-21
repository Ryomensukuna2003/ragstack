import { readFileSync } from 'fs';

import pdf from 'pdf-parse';
import { extractRawText } from 'mammoth';

export async function parseDoc(file) {
  const buffer = readFileSync(file.path);
  const ext = file.originalname.split('.').pop();

  if (ext === 'pdf') {
    // Use 'pdf' instead of 'pdfParse'
    const data = await pdf(buffer);
    return data.text;
  } else if (ext === 'docx') {
    const data = await extractRawText({ buffer });
    return data.value;
  } else if (ext === 'txt') {
    return readFileSync(file.path, 'utf8');
  }

  return '';
}