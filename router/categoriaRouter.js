import express from 'express';
import { GetIndex, GetCreate, PostCreate, 
    Delete, GetEdit, PostEdit } from '../controller/categoriaController.js';

const router = express.Router();

//libros route
router.get('/index', GetIndex);
router.get('/create', GetCreate);
router.post('/create', PostCreate);
router.post('/delete', Delete);
router.get('/edit/:categoriasId', GetEdit);
router.post('/edit/:categoriasId', PostEdit);
// router.get("/detalle/:id", GetDetalle);

export default router;