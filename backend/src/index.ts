import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/firebaseRouter';
import companyRoutes from './routes/companyRouter'
import { chatbotResponse } from './controllers/gptController';
import multer from 'multer';
import { upsertDocuments, upsertJsonDocument, upsertChatMessageToPinecone,upsertBotText } from './config/pinecone';
import { getChatGptResponse } from './controllers/gptController';
import { searchQuery } from './config/pinecone';
const cors = require('cors');


dotenv.config();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;
const memory: Map<string, string[]> = new Map();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); 
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); 
  },
});

const upload = multer({ storage: storage });

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/companies', companyRoutes);

app.post('/chatbot', chatbotResponse);

app.post('/uploadDocuments', upload.array('documents'), async (req, res) => {
  try {
    if (!req.files || !Array.isArray(req.files)) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    console.log(req.files[0].path)

    const filePaths = (req.files as Express.Multer.File[]).map((file) => file.path);

    await upsertDocuments(filePaths);

    res.status(200).json({ message: 'Documents uploaded successfully' });
  } catch (error) {
    console.error('Error uploading documents:', error);
    res.status(500).json({ error: 'Failed to upload documents' });
  }
});

app.post('/uploadJsonDocument', async (req, res) => {
  try {
    const { jsonData, subject } = req.body as { jsonData: object; subject: string };

    if (!jsonData || !subject) {
      return res.status(400).json({ error: 'jsonData and subject are required' });
    }

    await upsertJsonDocument(jsonData, subject);

    res.status(200).json({ message: 'JSON document uploaded successfully' });
  } catch (error) {
    console.error('Error uploading JSON document:', error);
    res.status(500).json({ error: 'Failed to upload JSON document' });
  }
});

app.post('/uploadText', async (req, res) => {
  try {
    const { botDescription} = req.body as { botDescription: string };

    if (!botDescription) {
      return res.status(400).json({ error: 'jsonData and subject are required' });
    }

    await upsertBotText(botDescription);

    res.status(200).json({ message: 'Text uploaded successfully' });
  } catch (error) {
    console.error('Error uploading JSON document:', error);
    res.status(500).json({ error: 'Failed to upload JSON document' });
  }
});

app.post('/uploadChats', async (req, res) => {
  try {
    const { chat } = req.body as { chat: string };

    if (!chat) {
      return res.status(400).json({ error: 'jsonData and subject are required' });
    }

    await upsertChatMessageToPinecone(chat);

    res.status(200).json({ message: 'Chat uploaded successfully' });
  } catch (error) {
    console.error('Error uploading chat messages:', error);
    res.status(500).json({ error: 'Failed to upload JSON document' });
  }
});


app.post('/chat', async (req: Request, res: Response) => {
  const { userId, query } = req.body as { userId: string; query: string };

  try {
    const searchResults = await searchQuery(query);
    const context = searchResults.map((match) => match.metadata?.context).join('\n');

    const userMemory = memory.get(userId) || [];
    const prompt = `${context}\n\n${userMemory.join('\n')}\nUser: ${query}\nAI:`;
    console.log(prompt);

    const reply = await getChatGptResponse(prompt);

    userMemory.push(`User: ${query}`);
    userMemory.push(`AI: ${reply}`);
    if (userMemory.length > 10) userMemory.splice(0, userMemory.length - 10); 
    memory.set(userId, userMemory);

    res.json({ reply });
  } catch (error) {
    console.error('Error handling chat request:', error);
    res.status(500).json({ error: 'Failed to process chat request' });
  }
});

app.get('/', (req, res) => {
  res.send('Firebase API Server');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
