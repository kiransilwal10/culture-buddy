import express from 'express';
import { saveUser, getUsers,checkIfUserExists } from '../controllers/user';

const router = express.Router();

// User routes
router.post('/save', saveUser);
router.get('/all', getUsers);
router.post('/check', checkIfUserExists);

export default router;
