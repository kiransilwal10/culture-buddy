import express from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import pdf from 'pdf-parse';
import { Pinecone } from '@pinecone-database/pinecone';
import { getEmbeddings } from '../controllers/gptController';
import mammoth from 'mammoth';  // For DOCX file processing

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY as string,
});
const PINECONE_INDEX_NAME = 'culturebuddy';

const app = express();

const upload = multer({ dest: 'uploads/' });  // Temporary folder for storing uploaded files

interface Document {
  id: string;
  subject: string;
  context: string;
}

interface Vector {
  id: string;
  values: number[];
  metadata: {
    subject: string;
    context: string;
  };
}

async function extractTextFromFile(filePath: string): Promise<string> {
  console.log('Absolute file path:', path.resolve(filePath));
  const extension = path.extname(filePath);  // Extract extension from mimetype

  console.log(`Processing file: ${filePath}, Type: ${extension}`);

  if (extension === '.pdf') {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdf(dataBuffer);
    return pdfData.text;
  } else if (extension === '.txt') {
    // Handle simple text files
    return fs.readFileSync(filePath, 'utf-8');
  } else if (extension === '.msword' || extension === 'wordprocessingml.document') {
    // Handle DOCX files
    const docxBuffer = fs.readFileSync(filePath);
    const { value } = await mammoth.extractRawText({ buffer: docxBuffer });
    return value;
  } else {
    throw new Error(`Unsupported file type: ${extension}`);
  }
}

// Function to upsert documents into Pinecone
export const upsertDocuments = async (filePaths: string[]): Promise<void> => {
  const index = pc.Index(PINECONE_INDEX_NAME);

  const docs: Document[] = await Promise.all(
    filePaths.map(async (filePath, idx) => {
      const text = await extractTextFromFile(filePath);
      return {
        id: `doc-${idx}`,
        subject: path.basename(filePath),
        context: text,
      };
    })
  );

  const vectors: Vector[] = await Promise.all(
    docs.map(async (doc) => ({
      id: doc.id,
      values: await getEmbeddings(doc.context),
      metadata: {
        subject: doc.subject,
        context: doc.context,
      },
    }))
  );

  // Upsert the array of Vector objects directly into Pinecone
  await index.upsert(vectors);
};

export const searchQuery = async (query: string): Promise<Vector[]> => {
    const index = pc.Index(PINECONE_INDEX_NAME);
    const queryEmbedding = await getEmbeddings(query);
  
    const results = await index.query({
      topK: 1,
      vector: queryEmbedding,
      includeMetadata: true,
    });
  
    const vectors: Vector[] = results.matches?.map(match => {
      const metadata = match.metadata ?? { subject: 'Unknown', context: 'No context available' };
      return {
        id: match.id,
        values: match.values,
        metadata: {
          subject: String(metadata.subject), 
          context: String(metadata.context),  
        },
      };
    }) || [];
  
    return vectors;
  };
  
  
