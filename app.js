import './utils/LoadEnvConfig.js';
import express from 'express';
import {engine} from 'express-handlebars';
import { projectRoot } from './utils/paths.js';
import path from 'path';
import homeRoutes from './router/home.js'
import librosRoutes from './router/librosRouter.js';
import categoriasRoutes from './router/categoriaRouter.js';
import autoresRoutes from './router/autorRouter.js';
import editorialesRoutes from './router/editorialRouter.js';
import context from './context/appContext.js'
import {GetSection} from './utils/helpers/section.js'
import {Equals} from './utils/helpers/compare.js';

const app = express();

//render engine
app.engine('hbs', engine({
  layoutsDir: "views/layouts",
  defaultLayout: "main",
  extname: "hbs",
  helpers: {
    section: GetSection,
    eq: Equals,
    includes: function (array, value) {
      return Array.isArray(array) && array.includes(value);
    },
  }
}));


app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(projectRoot, 'public')));

//routes 
app.use(homeRoutes);
app.use('/libros', librosRoutes);
app.use('/categorias', categoriasRoutes);
app.use('/autores', autoresRoutes);
app.use('/editoriales', editorialesRoutes);

app.use((req, res) => {
    res.status(404).render('404', {title: "Page not found"});
});

context.sequelize
    .sync({force: true})
    .then(()=> {
      app.listen(process.env.PORT || 5000);
      console.log("Database corrected succefully");
    }) 
    .catch((err) => {
      console.error("Erro connecting to the database: ", err)
    })
