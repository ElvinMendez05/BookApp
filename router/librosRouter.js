import express from 'express';
import { GetIndex, GetCreate, PostCreate, 
    Delete, GetEdit, PostEdit, GetDetalle} from '../controller/librosController.js';

const router = express.Router();

//libros route
router.get('/index', GetIndex);
router.get('/create', GetCreate);
router.post('/create', PostCreate);
router.post('/delete', Delete);
router.get('/edit/:librosId', GetEdit);
router.post('/edit/:librosId', PostEdit);
router.get("/detalle/:id", GetDetalle);

export default router;