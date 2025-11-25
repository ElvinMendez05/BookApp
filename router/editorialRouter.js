import express from 'express';
import { GetIndex, GetCreate, PostCreate, 
    Delete, GetEdit, PostEdit } from '../controller/editorialesController.js';
import isAuth from '../middlewares/isAuth.js';

const router = express.Router();

//libros route
router.get('/index', isAuth, GetIndex);
router.get('/create', isAuth, GetCreate);
router.post('/create', isAuth, PostCreate);
router.post('/delete', isAuth, Delete);
router.get('/edit/:editorialesId', isAuth, GetEdit);
router.post('/edit', isAuth, PostEdit);

export default router;