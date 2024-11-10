import { Request, Response } from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import axios from 'axios';


dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const chatbotResponse = async (req: Request, res: Response) => {
  try {
    const { userMessage } = req.body; // Receive only the latest user message

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful and friendly chatbot assistant.' },
        { role: 'user', content: userMessage },
      ],
    });

    const chatbotReply = completion.choices[0].message.content;

    res.status(200).json({ reply: chatbotReply });
  } catch (error) {
    console.error('Error generating chatbot response:', error);
    res.status(500).json({ error: 'Failed to generate chatbot response' });
  }
};

 export const getChatGptResponse = async(prompt: string): Promise<string> => {
  try {
    const userMessage  = prompt; // Receive only the latest user message

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful and friendly chatbot assistant.' },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const chatbotReply = completion.choices[0].message.content;

    return chatbotReply as string;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to get response from OpenAI API');
  }
}

// Function to estimate the number of tokens based on the text length
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4); // Approximation: 1 token ≈ 4 characters
}

// Function to split text into smaller chunks based on token limit
function splitTextIntoChunks(text: string, tokenLimit: number): string[] {
  const chunks: string[] = [];
  let currentChunk = "";
  let currentTokenCount = 0;

  const words = text.split(' '); // Split by spaces (this can be adjusted)

  for (const word of words) {
    const tokenCountForWord = estimateTokens(word);

    // If adding this word exceeds the token limit, start a new chunk
    if (currentTokenCount + tokenCountForWord > tokenLimit) {
      chunks.push(currentChunk.trim());
      currentChunk = word + " ";
      currentTokenCount = tokenCountForWord;
    } else {
      currentChunk += word + " ";
      currentTokenCount += tokenCountForWord;
    }
  }

  // Add the last chunk
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

// Function to get embeddings for a large text by splitting it into chunks
export async function getEmbeddings(text: string): Promise<number[]> {
  const tokenLimit = 8192; // token limit for `text-embedding-ada-002`
  const chunks = splitTextIntoChunks(text, tokenLimit - 100); // Keep a buffer of 100 tokens
  
  const embeddings: number[][] = []; // Store embeddings as an array of arrays

  try {
    for (const chunk of chunks) {
      const response = await axios.post(
        'https://api.openai.com/v1/embeddings',
        {
          model: 'text-embedding-ada-002',
          input: chunk,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          },
        }
      );
      
      // Assuming each response.data.data[0].embedding is an array of numbers
      const chunkEmbedding = response.data.data[0].embedding;
      embeddings.push(chunkEmbedding); // Add each chunk's embedding to the result
    }
    
    // Optional: Combine embeddings if necessary (e.g., averaging)
    const combinedEmbedding = averageEmbeddings(embeddings);

    return combinedEmbedding;
  } catch (error) {
    console.error('Error getting embeddings:', error);
    return [];
  }
}

// Function to average the embeddings (assuming each embedding is an array of numbers)
function averageEmbeddings(embeddings: number[][]): number[] {
  const numEmbeddings = embeddings.length;
  const numDimensions = embeddings[0].length; // Get the length of the first embedding

  // Initialize an array to store the averaged embeddings
  const averaged = new Array(numDimensions).fill(0);

  // Sum up the embeddings
  embeddings.forEach((embedding) => {
    for (let i = 0; i < numDimensions; i++) {
      averaged[i] += embedding[i];
    }
  });

  // Divide by the number of embeddings to average them
  for (let i = 0; i < numDimensions; i++) {
    averaged[i] /= numEmbeddings;
  }

  return averaged;
}

