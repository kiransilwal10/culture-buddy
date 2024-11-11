import { Request, Response } from 'express';
import { db } from '../config/firebase';  // Using the Firebase Admin instance for backend
import { DocumentData, DocumentReference, CollectionReference } from 'firebase-admin/firestore';
import { upsertUsersToPinecone } from '../config/pinecone';

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  about: string;
}
// Save user to Firestore
export const saveUser = async (req: Request, res: Response) => {
  const { id, firstname, lastname, email, about } = req.body;
 console.log(req.body);
 console.log(id);
  try {
    const usersCollection: CollectionReference<DocumentData> = db.collection('users');
    const docRef: DocumentReference<DocumentData> = await usersCollection.add({
      id,
      firstname,
      lastname,
      email,
      about
    });
    const snapshot = await usersCollection.get();
    const allUsers: User[] = snapshot.docs.map(doc => doc.data() as User); // Cast

    // Upsert all users to Pinecone as a single vector
    await upsertUsersToPinecone(allUsers);
    
    return res.status(201).json({ message: 'User saved successfully', id: docRef.id });

  } catch (error) {
    console.error("Error saving user:", error);
    return res.status(500).json({ error: 'Failed to save user' });
  }
};

// Retrieve users from Firestore
export const getUsers = async (req: Request, res: Response) => {
  try {
    const usersCollection: CollectionReference<DocumentData> = db.collection('users');
    const snapshot = await usersCollection.get();

    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as { id: string; firstname: string; lastname: string; email: string; about:string }[];

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error getting users:", error);
    return res.status(500).json({ error: 'Failed to get users' });
  }
};

export const checkIfUserExists = async (req: Request, res: Response) => {
  const { email } = req.body;  // Get the email from the request body

  try {
    const usersCollection: CollectionReference<DocumentData> = db.collection('users');
    
    // Query the users collection to find a user with the provided email
    const querySnapshot = await usersCollection.where('email', '==', email).get();

    if (querySnapshot.empty) {
      // If no user found with the provided email
      return res.status(404).json({ message: 'No user found with the provided email.' });
    }

    // If a user exists, send the first result (assuming emails are unique)
    const user = querySnapshot.docs[0].data();
    return res.status(200).json({ message: 'User exists', user });
  } catch (error) {
    console.error("Error checking if user exists:", error);
    return res.status(500).json({ error: 'Failed to check if user exists' });
  }
};
