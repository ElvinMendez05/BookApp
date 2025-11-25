import express from 'express';
import { GetIndex, GetCreate, PostCreate, 
    Delete, GetEdit, PostEdit, GetDetalle} from '../controller/librosController.js';
import isAuth from '../middlewares/isAuth.js';

const router = express.Router();

//libros route
router.get('/index', isAuth, GetIndex);
router.get('/create', isAuth, GetCreate);
router.post('/create', isAuth, PostCreate);
router.post('/delete', isAuth, Delete);
router.get('/edit/:librosId', isAuth, GetEdit);
router.post('/edit/:librosId', isAuth, PostEdit);
router.get("/detalle/:id", isAuth, GetDetalle);

export default router;