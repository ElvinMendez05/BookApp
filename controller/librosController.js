import context from "../context/appContext.js";

export function GetIndex (req, res, next) {
    context.LibroModel.findAll()
      .then((result) => {
        const libros = result.map((result) => result.dataValues);
        console.log("Libros fetched successfully: ", result);

        res.render("libros/index", {
             librosList: libros,
             hasLibros: libros.length > 0,
             "page-title": "Index Libros"});
      })
      .catch((err) => {
        console.log("Error fetching libros", err);
      })
};

export function GetCreate(req, res, next) {
  Promise.all([
    context.CategoriaModel.findAll(),
    context.AutorModel.findAll(),
    context.EditorialModel.findAll()
  ])
    .then(([categorias, autores, editoriales]) => {
      res.render("libros/save", {
        editMode: false,
        categorias: categorias.map((c) => c.dataValues),
        autores: autores.map((a) => a.dataValues),
        editoriales: editoriales.map((e) => e.dataValues),
        "page-title": "Nuevo Libro"
      });
    })
    .catch((err) => {
      console.log("Error cargando datos para crear libro:", err);
    });
}

export function PostCreate (req, res, next) {
    const nombre = req.body.nombre;
    const imagen = req.body.imagen;
    const anioPublicacion = req.body.anioPublicacion;
    const categoriaId = req.body.categoriaId;
    const autorId = req.body.autorId;
    const editorialId = req.body.editorialId;

    context.LibroModel.create({
        nombre: nombre,
        imagen: imagen,
        anioPublicacion: anioPublicacion,
        categoriaId: categoriaId,
        autorId: autorId,
        editorialId: editorialId,
    })
    .then(() => {
         res.redirect("/libros/index");
      })
      .catch((err) => {
        console.log("Error creando libro:", err);
      })
};

export function GetEdit(req, res, next) {
  const id = req.params.librosId;

  context.LibroModel.findOne({ where: { id: id } })
    .then((result) => {
      if (!result) {
        return res.redirect("/libros/index");
      }

      const librosList = result.dataValues;

      return Promise.all([
        context.CategoriaModel.findAll(),
        context.AutorModel.findAll(),
        context.EditorialModel.findAll()
      ]).then(([categorias, autores, editoriales]) => {
        res.render("libros/save", {
          editMode: true,
          librosList: librosList,
          categorias: categorias.map((c) => c.dataValues),
          autores: autores.map((a) => a.dataValues),
          editoriales: editoriales.map((e) => e.dataValues),
          "page-title": `Editar Libro: ${librosList.nombre}`
        });
      });
    })
    .catch((err) => {
      console.log("Error cargando libro para editar:", err);
    });
}

// export function GetEdit (req, res, next) {
//     const id = req.params.librosId;

//     context.LibroModel.findOne({where: {id: id}})
//     .then((result) => {
//         if (!result) {
//             return res.redirect("libros/index");
//         }

//         const librosList = result.dataValues;

//          res.render("libros/save", {
//             editMode: true,
//             librosList: librosList,
//             "page-title": `Edit Index Libros ${librosList.nombre}`});
//     })
//     .catch((err) => {
//         console.log("Error fetching libro", err);
//     })
// };

export function PostEdit (req, res, next) {
    const id = req.body.librosId;
    const nombre = req.body.nombre;
    const imagen = req.body.imagen;
    const anioPublicacion = req.body.anioPublicacion;
    const categoriaId = req.body.categoriaId;
    const autorId = req.body.autorId;
    const editorialId = req.body.editorialId;

    context.LibroModel.findOne({where: {id: id}})
    .then((result) => {
        if (!result) {
            return res.redirect("libros/index");
        }

        context.LibroModel.update(
            {
                nombre: nombre,
                imagen: imagen,
                anioPublicacion: anioPublicacion,
                categoriaId: categoriaId,
                autorId: autorId,
                editorialId: editorialId
            },
            {where: {id: id}}
        ) 
         .then(()=> {
            return res.redirect("/libros/index")
         })
         .catch((err) => {
            console.log("Error actualizando libro:", err);
         })
    })
    .catch((err) => {
        console.log("Error buscando libro", err);
    })
};

export function Delete (req, res, next) {
    const id = req.body.librosId;
    
    context.LibroModel.findOne({where: {id: id}})
    .then((result) => {
        if (!result) {
            return res.redirect("libros/index");
        }
        
        context.LibroModel.destroy({where: {id: id}}) 
         .then(()=> {
            return res.redirect("/libros/index")
         })
         .catch((err) => {
            console.log("Error eliminando libro:", err);
         })
    })
    .catch((err) => {
        console.log("Error buscando libro", err);
    })
};
