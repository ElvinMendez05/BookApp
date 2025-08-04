import express from 'express';
import { GetIndex, GetCreate, PostCreate, 
    Delete, GetEdit, PostEdit } from '../controller/editorialesController.js';

const router = express.Router();

//libros route
router.get('/index', GetIndex);
router.get('/create', GetCreate);
router.post('/create', PostCreate);
router.post('/delete', Delete);
router.get('/edit/:editorialesId', GetEdit);
router.post('/edit', PostEdit);

export default router;