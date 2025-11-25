import express from 'express';
import { GetIndex, GetCreate, PostCreate, 
    Delete, GetEdit, PostEdit } from '../controller/autoresController.js';
import isAuth from '../middlewares/isAuth.js';

const router = express.Router();

//Editoriales route
router.get('/index', isAuth,GetIndex);
router.get('/create', isAuth, GetCreate);
router.post('/create', isAuth, PostCreate);
router.post('/delete', isAuth, Delete);
router.get('/edit/:autoresId', isAuth, GetEdit);
router.get('/edit/:autoresId', isAuth, GetEdit);
router.post('/edit', isAuth, PostEdit);

export default router;