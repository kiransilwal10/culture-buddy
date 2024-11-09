import express from 'express';
import { saveUser, getUsers } from '../controllers/user';

const router = express.Router();

router.post('/save', saveUser);

router.get('/all', getUsers);

export default router;
