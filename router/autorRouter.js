import express from 'express';
import { GetIndex, GetCreate, PostCreate, 
    Delete, GetEdit, PostEdit } from '../controller/autoresController.js';

const router = express.Router();

//Editoriales route
router.get('/index', GetIndex);
router.get('/create', GetCreate);
router.post('/create', PostCreate);
router.post('/delete', Delete);
router.get('/edit/:autoresId', GetEdit);
router.post('/edit/:autoresId', PostEdit);

export default router;