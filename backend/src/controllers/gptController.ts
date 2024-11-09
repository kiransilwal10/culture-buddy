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

export async function getEmbeddings(text: string): Promise<number[]> {
  const response = await axios.post(
    'https://api.openai.com/v1/embeddings',
    {
      model: 'text-embedding-ada-002',
      input: text,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    }
  );
  return response.data.data[0].embedding;
}
