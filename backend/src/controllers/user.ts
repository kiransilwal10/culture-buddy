import { Request, Response } from 'express';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';  
import { db } from '../config/firebase';

export const saveUser = async (req: Request, res: Response) => {
  const { name, age, email } = req.body;

  try {
    const usersCollection = collection(db, 'users');
    const docRef = await addDoc(usersCollection, { name, age, email });
    return res.status(201).json({ message: 'User saved successfully', id: docRef.id });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to save user' });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const usersCollection = collection(db, 'users');
    const snapshot = await getDocs(usersCollection);

    const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() as { name: string; age: number; email: string } }));

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to get users' });
  }
};
