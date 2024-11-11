import express from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import pdf from 'pdf-parse';
import { Pinecone } from '@pinecone-database/pinecone';
import { getEmbeddings } from '../controllers/gptController';
import mammoth from 'mammoth';
import { v4 as uuidv4 } from 'uuid';

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY as string,
});
const PINECONE_INDEX_NAME = 'culturebuddy';
const app = express();
const upload = multer({ dest: 'uploads/' });

interface Document {
  id: string;
  subject: string;
  context: string;
}

interface Metadata {
  subject: string;
  context: string;
  // Add other fields if needed
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
  const extension = path.extname(filePath); 

  console.log(`Processing file: ${filePath}, Type: ${extension}`);

  if (extension === '.pdf') {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdf(dataBuffer);
    return pdfData.text;
  } else if (extension === '.txt') {
    return fs.readFileSync(filePath, 'utf-8');
  } else if (extension === '.msword' || extension === 'wordprocessingml.document') {
    const docxBuffer = fs.readFileSync(filePath);
    const { value } = await mammoth.extractRawText({ buffer: docxBuffer });
    return value;
  } else {
    throw new Error(`Unsupported file type: ${extension}`);
  }
}

function getContentSize(content: string): number {
  return Buffer.byteLength(content, 'utf-8');
}



// Function to split document content if it exceeds the size limit
function splitContent(content: string): string[] {
  const maxContentSize = 40960; // Pinecone's metadata limit in bytes
  const contentSize = getContentSize(content);

  if (contentSize <= maxContentSize) {
    return [content]; // Return the single content if it's within the size limit
  }

  // Split content into two parts if it exceeds the size limit
  const midPoint = Math.floor(content.length / 2);
  const part1 = content.slice(0, midPoint);
  const part2 = content.slice(midPoint);

  return [part1, part2]; // Return two parts of content
}
interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  about: string;
}

export const upsertChatMessageToPinecone = async (chatMessage: string) => {
  const embedding = await getEmbeddings(chatMessage);

  const metadata = {
    message: chatMessage,
    timestamp: new Date().toISOString(), 
    context: "ChatMessage",
  };

  const index = pc.Index(PINECONE_INDEX_NAME);
  const currentVectorId = 'chat-record';

  try {
    // const queryResult = await index.query({
    //   id: currentVectorId ,
    //   topK: 1,   
    //   includeMetadata: true,
    // });
    
    const metadataParts = splitContent(JSON.stringify(metadata));

    for (var i = 0; i < metadataParts.length;i++) {
        await index.update({
          id:`chat-record${i === 0 ? '' : '2'}`,
          metadata: {
            subject: "ChatMessage",  
            context: metadataParts[i]as string, 
          },
        });
    }


    console.log(`Upserted to record`);
  } catch (error) {
    console.error("Error querying Pinecone:", error);
  }
};

// Function to split metadata if the size exceeds the limit
function splitMetadata(metadata: object): object[] {
  const maxMetadataSize = 40960; // Pinecone's metadata limit in bytes
  const metadataSize = Buffer.byteLength(JSON.stringify(metadata), 'utf8');

  if (metadataSize <= maxMetadataSize) {
    return [metadata]; // Return the single metadata object if it's within the size limit
  }

  // Split metadata into two parts if it exceeds the size limit
  const halfMetadata = Math.ceil(Object.keys(metadata).length / 2);
  const metadataPart1 = Object.fromEntries(Object.entries(metadata).slice(0, halfMetadata));
  const metadataPart2 = Object.fromEntries(Object.entries(metadata).slice(halfMetadata));

  return [metadataPart1, metadataPart2];
}


export const upsertUsersToPinecone = async (users: User[]) => {
  // Combine all user details into a single string for embedding generation
  const combinedUserDetails = users.map(user => {
    return `${user.firstname} ${user.lastname}, Email: ${user.email}, About: ${user.about}`;
  }).join(" | ");

  // Generate embeddings for the combined user details
  const embedding = await getEmbeddings(combinedUserDetails);

  // Prepare metadata with all users' data
  const metadata = {
    users: users.map(user => ({
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      about: user.about,
    })),
    context: "EmployeeData",
  };

  // Fetch the current vector from Pinecone using its ID, e.g., 'all-users'
  const index = pc.Index(PINECONE_INDEX_NAME);
  const currentVectorId = 'all-users';

  try {
    // // Query Pinecone to check if the 'all-users' vector already exists
    // const queryResult = await index.query({
    //   topK: 1,
    //   vector: await getEmbeddings("dummy"), // We don't care about the dummy vector, just querying by ID
    //   filter: { id: currentVectorId }, // Use a filter to find the record by ID
    //   includeMetadata: true,
    // });


    const metadataParts = splitContent(JSON.stringify(metadata));

    for (var i = 0; i < metadataParts.length;i++) {
        await index.update({
          id:`all-users${i === 0 ? '' : '2'}`,
          metadata: {
            subject: "EmployeeData",  
            context: metadataParts[i]as string, 
          },
        });
    }

    console.log(`Upserted torecord`);
  } catch (error) {
    console.error("Error querying Pinecone:", error);
  }
};


// Function to upsert documents with content size check and split if necessary
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

  

  // Iterate through the documents and handle content size check
  for (const doc of docs) {
    const embedding = await getEmbeddings(doc.context);

    const contentParts = splitContent(doc.context); // Split content if it exceeds size limit

    // If content is split, create separate vectors for each part
    for (const part of contentParts) {
      const uniqueId = `doc-${Date.now()}-${uuidv4()}`;
      const vectors: Vector[] = [];
      vectors.push({
        id: uniqueId,
        values: embedding,
        metadata: {
          subject: doc.subject,  
          context: part, 
        },
      });
        // Upload the vectors to Pinecone
      await index.upsert(vectors);
    }
  }

};

export const upsertJsonDocument = async (jsonData: object, subject: string): Promise<void> => {
  const index = pc.Index(PINECONE_INDEX_NAME);

  const context = JSON.stringify(jsonData);
  const uniqueId = `doc-${Date.now()}-${uuidv4()}`;
  const doc: Document = {
    id: uniqueId,  
    subject: subject,
    context: context,
  };

  const vector: Vector = {
    id: doc.id,
    values: await getEmbeddings(doc.context),
    metadata: {
      subject: doc.subject,
      context: doc.context,
    },
  };
  await index.upsert([vector]);
};

export const upsertBotText = async (text: string) => {
  const embedding = await getEmbeddings(text);

  const index = pc.Index(PINECONE_INDEX_NAME);

  try {
    const metadataParts = splitContent(text);

    for (const part of metadataParts) {
      const uniqueId = `doc-${Date.now()}-${uuidv4()}`;
      const vectors: Vector[] = [];
      vectors.push({
        id: uniqueId,
        values: embedding,
        metadata: {
          subject: "BotInfo",  
          context: part, 
        },
      });
        // Upload the vectors to Pinecone
      await index.upsert(vectors);
    }


    console.log(`Upserted to record`);
  } catch (error) {
    console.error("Error querying Pinecone:", error);
  }
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
  
  
