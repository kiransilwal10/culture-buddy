import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/firebaseRouter';
import { chatbotResponse } from './controllers/gptController';
import multer from 'multer';
import { upsertDocuments } from './config/pinecone';
import { getChatGptResponse } from './controllers/gptController';
import { searchQuery } from './config/pinecone';

dotenv.config();

const app = express();
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