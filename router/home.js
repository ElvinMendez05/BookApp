import express from 'express';
import { GetIndex } from '../controller/homeController.js';
import isAuth from '../middlewares/isAuth.js';

const router = express.Router();

router.get('/home', isAuth, GetIndex);

export default router;
