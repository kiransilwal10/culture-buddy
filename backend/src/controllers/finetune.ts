import { Request, Response } from 'express';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to create a JSONL file from the provided strings (Q&A pairs)
const createJSONLFile = (data: { prompt: string; completion: string }[]) => {
  const filePath = path.join(__dirname, 'fine-tuning-data.jsonl');
  const writeStream = fs.createWriteStream(filePath);

  data.forEach((entry) => {
    writeStream.write(JSON.stringify(entry) + '\n');
  });

  writeStream.end();
  return filePath;
};

// Endpoint to receive policy data and fine-tune the model
// export const fineTuneModel = async (req: Request, res: Response) => {
//   try {
//     const { policyData } = req.body; // Expecting policyData to be an array of Q&A pairs

//     if (!policyData || !Array.isArray(policyData)) {
//       return res.status(400).json({ error: 'Invalid policy data format. It should be an array of objects.' });
//     }

//     // Format the policy data into JSONL format
//     const formattedData = policyData.map((item: { question: string; answer: string }) => ({
//       prompt: item.question,
//       completion: item.answer,
//     }));

//     // Create a JSONL file
//     const jsonlFilePath = createJSONLFile(formattedData);

//     // Upload the JSONL file to OpenAI for fine-tuning
//     const file = fs.createReadStream(jsonlFilePath);
//     const openaiResponse = await openai.files.create({
//       purpose: 'fine-tune',
//       file: file,
//     });

//     const fileId = openaiResponse.id;
//     console.log('File uploaded:', fileId);

//     // Start the fine-tuning process
//     const fineTuneResponse = await openai.fineTunes.create({
//       training_file: fileId,
//       model: 'gpt-3.5-turbo', // You can change this to the model of your choice
//     });

//     console.log('Fine-tuning started:', fineTuneResponse);

//     // Return response with fine-tuning job details
//     res.status(200).json({
//       message: 'Fine-tuning started successfully.',
//       fineTuneJob: fineTuneResponse,
//     });
//   } catch (error) {
//     console.error('Error during fine-tuning:', error);
//     res.status(500).json({ error: 'Failed to start fine-tuning' });
//   }
// };

// Endpoint to check the status of a fine-tuning job
// export const getFineTuneStatus = async (req: Request, res: Response) => {
//   const { jobId } = req.params;

//   try {
//     // Fetch fine-tuning status by jobId
//     const fineTuneStatus = await openai.fineTunes.retrieve(jobId);
//     res.status(200).json(fineTuneStatus);
//   } catch (error) {
//     console.error('Error fetching fine-tuning status:', error);
//     res.status(500).json({ error: 'Failed to retrieve fine-tuning status' });
//   }
// };
