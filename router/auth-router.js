import express from 'express';
import { GetLogin } from '../controller/authController.js';

const router = express.Router();

//Home route
router.get('/', GetLogin);

export default router;