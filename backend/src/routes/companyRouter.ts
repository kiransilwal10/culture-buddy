import express from 'express';
import { saveCompany,getCompanies,checkIfCompanyExists } from '../controllers/company';

const router = express.Router();

// Save a company
router.post('/save', saveCompany);

// Get all companies
router.get('/all', getCompanies);

// Check if a company exists based on employer email
router.post('/check', checkIfCompanyExists);

export default router;
