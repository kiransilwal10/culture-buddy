import { Request, Response } from 'express';
import { db } from '../config/firebase';  
import { DocumentData, DocumentReference, CollectionReference } from 'firebase-admin/firestore';
import { upsertChatMessageToPinecone } from '../config/pinecone';


export const saveCompany = async (req: Request, res: Response) => {
  const { companyName, employerEmail, industry, numberOfWorkers, botName, coreValues, botTone, botPersonality } = req.body;

  try {
    const companiesCollection: CollectionReference<DocumentData> = db.collection('companies');
    const docRef: DocumentReference<DocumentData> = await companiesCollection.add({
      companyName,
      employerEmail,
      industry,
      numberOfWorkers,
      botName,
      coreValues,
      botTone,
      botPersonality
    });

    return res.status(201).json({ message: 'Company saved successfully', id: docRef.id });
  } catch (error) {
    console.error("Error saving company:", error);
    return res.status(500).json({ error: 'Failed to save company' });
  }
};

// Retrieve all companies from Firestore
export const getCompanies = async (req: Request, res: Response) => {
  try {
    const companiesCollection: CollectionReference<DocumentData> = db.collection('companies');
    const snapshot = await companiesCollection.get();

    const companies = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as { 
      id: string;
      companyName: string;
      employerEmail: string;
      industry: string;
      numberOfWorkers: number;
      botName: string;
      coreValues: string;
      botTone: string;
      botPersonality: string;
    }[];

    return res.status(200).json(companies);
  } catch (error) {
    console.error("Error getting companies:", error);
    return res.status(500).json({ error: 'Failed to get companies' });
  }
};

export const checkIfCompanyExists = async (req: Request, res: Response) => {
    const { employerEmail } = req.body;  // Get the employer email from the request body
  
    try {
      const companiesCollection: CollectionReference<DocumentData> = db.collection('companies');
      
      // Query the companies collection to find a company with the provided employerEmail
      const querySnapshot = await companiesCollection.where('employerEmail', '==', employerEmail).get();
  
      if (querySnapshot.empty) {
        // If no company found with the provided email
        return res.status(404).json({ message: 'No company found with the provided employer email.' });
      }
  
      // If a company exists, send the first result (as we assume emails are unique)
      const company = querySnapshot.docs[0].data();
      return res.status(200).json({ message: 'Company exists', company });
    } catch (error) {
      console.error("Error checking if company exists:", error);
      return res.status(500).json({ error: 'Failed to check if company exists' });
    }
  };

interface ChatMessage {
  userId: string;
  message: string;
  timestamp: FirebaseFirestore.Timestamp;
  receiver: string;
}

// Save chat message to Firestore
export const saveChatMessage = async (req: Request, res: Response) => {
  const { userId, message, receiver, time } = req.body;
  const timestamp = new Date();

  try {
    // Reference to the "chats" collection
    const chatsCollection: CollectionReference<DocumentData> = db.collection('chats');
    
    // Add the chat message to Firestore
    const docRef: DocumentReference<DocumentData> = await chatsCollection.add({
      userId,
      message,
      timestamp,
      receiver
    });

    // Retrieve all chat messages in the collection
    const snapshot = await chatsCollection.get();
    const allChats: ChatMessage[] = snapshot.docs.map(doc => doc.data() as ChatMessage); // Cast

    // Combine all chats into one string with userId, message, time, and receiver
    const combinedChats = allChats
      .map(chat => `User: ${chat.userId}, Message: "${chat.message}", Time: ${chat.timestamp.toDate().toISOString()}, Receiver: ${chat.receiver}`)
      .join(" | ");  // Join all the chat messages with " | " separator

    // Upsert all chat messages to Pinecone (or another vector database)
    await upsertChatMessageToPinecone(combinedChats);
    
    return res.status(201).json({ message: 'Chat message saved successfully', id: docRef.id });

  } catch (error) {
    console.error("Error saving chat message:", error);
    return res.status(500).json({ error: 'Failed to save chat message' });
  }
};


