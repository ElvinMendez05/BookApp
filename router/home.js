import express from 'express';
import { GetHome } from '../controller/homeController.js';

const router = express.Router();

//Home route
router.get('/', GetHome);

export default router;