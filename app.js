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
import authRoutes from './router/auth-router.js'
import context from './context/appContext.js'
import {GetSection} from './utils/helpers/section.js'
import {Equals} from './utils/helpers/compare.js';
import multer from "multer"; 
import { v4 as guidV4 } from "uuid";
import session from "express-session";
import flash from "connect-flash"; 

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

// Set up multer for file uploads
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(projectRoot, "public", "assets", "img", "assets-images")); 
  },
  filename: (req, file, cb) => {
    const fileName = `${guidV4()}-${file.originalname}`; 
    cb(null, fileName);
  },
});

app.use(multer({ storage: imageStorage }).single("Imagen")); 

// Set up session management
app.use(
  session({
    secret: process.env.SESSION_SECRET || "anything",
    resave: false,
    saveUninitialized: false,
  })
); // Initialize session management

// Set up flash messages
app.use(flash()); // Initialize flash messages

// Middleware to make the user available in the request object
app.use((req, res, next) => {
  if (!req.session) {
    return next();
  }
  if (!req.session.user) {
    return next();
  }

  if (!req.session.isAuthenticated) {
    return next();
  }

  req.user = req.session.user; // Make the user available in the request object
  next();
});

//locals variables
app.use((req, res, next) => {
  const errors = req.flash("errors");
  res.locals.user = req.user; // Make the user available in views
  res.locals.hasUser = !!req.user; // Check if the user is logged in
  res.locals.isAuthenticated = req.session.isAuthenticated || false; // Check if the user is authenticated
  res.locals.errors = errors; // Make flash errors available in views
  res.locals.hasErrors = errors.length > 0; // Check if there are any errors
  res.locals.success = req.flash("success"); // Make flash success messages available in views
  res.locals.hasSuccess = res.locals.success.length > 0; // Check if there are any success messages
  next();
});

//routes 
 app.use(authRoutes)
 app.use(homeRoutes);
 app.use('/libros', librosRoutes);
 app.use('/categorias', categoriasRoutes);
 app.use('/autores', autoresRoutes);
 app.use('/editoriales', editorialesRoutes);

app.use((req, res) => {
  if (req.session && req.session.isAuthenticated) {
    return res.status(404).render("404", { "page-title": "Page Not Found" });
  }

  // If the user is not authenticated, render a different layout
  return res.status(404).render("404", {
    "page-title": "Page Not Found",
    layout: "anonymous-layout",
  });
});

try {
  // Sync the database and start the server
  const shouldForce = process.env.DB_FORCE === "true"; // Check if DB_FORCE is set to true
  const shouldAlter = process.env.DB_ALTER === "true"; // Check if DB_ALTER is set to true

  if (shouldForce) {
    await context.sequelize.sync({ force: true }); // Use force: true to drop and recreate tables
  } else {
   await context.sequelize.sync({ alter: shouldAlter || false });; //alter: true to update the schema without losing data {alter: true}
  }

  app.listen(process.env.PORT || 5000);
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
} catch (err) {
  console.error("Error setting up the application:", err);
}




// app.use(authRoutes)
// app.use(homeRoutes);
// app.use('/libros', librosRoutes);
// app.use('/categorias', categoriasRoutes);
// app.use('/autores', autoresRoutes);
// app.use('/editoriales', editorialesRoutes);

// app.use((req, res) => {
//     res.status(404).render('404', {title: "Page not found"});
// });

// try{
//   await context.sequelize.sync({alter: false});

//   app.listen(process.env.PORT || 5000);
//   console.log("Database corrected succefully");
// }catch(err){
//   console.error("Erro connecting to the database: ", err)
// }
