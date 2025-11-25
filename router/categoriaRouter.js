import express from 'express';
import { GetIndex, GetCreate, PostCreate, 
    Delete, GetEdit, PostEdit } from '../controller/categoriaController.js';
import isAuth from '../middlewares/isAuth.js';

const router = express.Router();

//libros route
router.get('/index', isAuth, GetIndex);
router.get('/create', isAuth, GetCreate);
router.post('/create', isAuth, PostCreate);
router.post('/delete', isAuth, Delete);
router.get('/edit/:categoriasId', isAuth, GetEdit);
router.post('/edit', isAuth, PostEdit);
// router.get("/detalle/:id", GetDetalle);

export default router;