import context from "../context/appContext.js";
import { sendEmail } from "../services/EmailServices.js";
export async function GetIndex(req, res, next) {
  try {
    const result = await context.LibroModel.findAll();
    const libros = result.map((r) => r.dataValues);
    console.log("Libros fetched successfully: ", result);

    res.render("libros/index", {
      librosList: libros,
      hasLibros: libros.length > 0,
      "page-title": "Index Libros",
    });
  } catch (err) {
    console.error("Error fetching libros", err);
  }
}

export async function GetCreate(req, res, next) {
  try {
    const [categorias, autores, editoriales] = await Promise.all([
      context.CategoriaModel.findAll(),
      context.AutorModel.findAll(),
      context.EditorialModel.findAll(),
    ]);

    res.render("libros/save", {
      editMode: false,
      categorias: categorias.map((c) => c.dataValues),
      autores: autores.map((a) => a.dataValues),
      editoriales: editoriales.map((e) => e.dataValues),
      "page-title": "Nuevo Libro",
    });
  } catch (err) {
    console.error("Error cargando datos para crear libro:", err);
  }
}

export async function PostCreate(req, res, next) {
  const { nombre, imagen, anioPublicacion, categoriaId, autorId, editorialId } = req.body;

  try {
    await context.LibroModel.create({
      nombre,
      imagen,
      anioPublicacion,
      categoriaId,
      autorId,
      editorialId,
    });

    await sendEmail({
      to: "elvinmendez005@gmail.com",
      subject: "Nuevo Libro",
      html: `<p>Un nuevo libro a sido creado:</p>
             <p><strong>Nombre:</strong> ${nombre}</p>
             <p><strong>Autor:</strong> ${autorId}</p>`,
    })

    res.redirect("/libros/index");
  } catch (err) {
    console.error("Error creando libro:", err);
  }
}

export async function GetEdit(req, res, next) {
  const id = req.params.librosId;

  try {
    const result = await context.LibroModel.findOne({ where: { id } });

    if (!result) {
      return res.redirect("/libros/index");
    }

    const librosList = result.dataValues;

    const [categorias, autores, editoriales] = await Promise.all([
      context.CategoriaModel.findAll(),
      context.AutorModel.findAll(),
      context.EditorialModel.findAll(),
    ]);

    res.render("libros/save", {
      editMode: true,
      librosList,
      categorias: categorias.map((c) => c.dataValues),
      autores: autores.map((a) => a.dataValues),
      editoriales: editoriales.map((e) => e.dataValues),
      "page-title": `Editar Libro: ${librosList.nombre}`,
    });
  } catch (err) {
    console.error("Error cargando libro para editar:", err);
  }
}

export async function PostEdit(req, res, next) {
  const id = req.body.librosId;
  const nombre = req.body.nombre;
  const imagen = req.body.imagen;
  const anioPublicacion = req.body.anioPublicacion;
  const categoriaId = req.body.categoriaId;
  const autorId = req.body.autorId;
  const editorialId = req.body.editorialId;

  try {
    const result = await context.LibroModel.findOne({ where: { id: id } });

    if (!result) {
      return res.redirect("/libros/index");
    }

    await context.LibroModel.update(
      {
        nombre: nombre,
        imagen: imagen,
        anioPublicacion: anioPublicacion,
        categoriaId: categoriaId,
        autorId: autorId,
        editorialId: editorialId,
      },
      { where: { id: id } }
    );

    return res.redirect("/libros/index");
  } catch (err) {
    console.error("Error actualizando libro:", err);
  }
}

export async function Delete(req, res, next) {
  const id = req.body.librosId;

  try {
    const result = await context.LibroModel.findOne({ where: { id } });

    if (!result) {
      return res.redirect("/libros/index");
    }

    await context.LibroModel.destroy({ where: { id } });

    res.redirect("/libros/index");
  } catch (err) {
    console.error("Error eliminando libro:", err);
  }
}

export async function GetDetalle(req, res, next) {
  const id = req.params.libroId;

  try {
    // Buscar el libro por ID, incluyendo las relaciones necesarias
    const libroResult = await context.LibroModel.findOne({
      where: { id },
      include: [
        context.CategoriaModel,
        context.AutorModel,
        {
          model: context.EditorialModel,
          attributes: ['nombre', 'pais', 'telefono'], // solo los campos que quieres mostrar
        },
      ],
    });

    if (!libroResult) {
      // Si no se encuentra el libro, redirigir o mostrar error
      return res.status(404).render("errors/404", { error: "Libro no encontrado" });
    }

    const libro = libroResult.get({ plain: true });

    // Renderizar la vista detalle con toda la info
    res.render("home/detalle", {
      "page-title": `Detalle del libro: ${libro.nombre}`,
      libro,
    });
  } catch (err) {
    console.error("Error en GetDetalle Libro:", err);
    res.status(500).render("errors/500", { error: "Error interno del servidor" });
  }
}


// import context from "../context/appContext.js";

// export function GetIndex (req, res, next) {
//     context.LibroModel.findAll()
//       .then((result) => {
//         const libros = result.map((result) => result.dataValues);
//         console.log("Libros fetched successfully: ", result);

//         res.render("libros/index", {
//              librosList: libros,
//              hasLibros: libros.length > 0,
//              "page-title": "Index Libros"});
//       })
//       .catch((err) => {
//         console.log("Error fetching libros", err);
//       })
// };

// export function GetCreate(req, res, next) {
//   Promise.all([
//     context.CategoriaModel.findAll(),
//     context.AutorModel.findAll(),
//     context.EditorialModel.findAll()
//   ])
//     .then(([categorias, autores, editoriales]) => {
//       res.render("libros/save", {
//         editMode: false,
//         categorias: categorias.map((c) => c.dataValues),
//         autores: autores.map((a) => a.dataValues),
//         editoriales: editoriales.map((e) => e.dataValues),
//         "page-title": "Nuevo Libro"
//       });
//     })
//     .catch((err) => {
//       console.log("Error cargando datos para crear libro:", err);
//     });
// }

// export function PostCreate (req, res, next) {
//     const nombre = req.body.nombre;
//     const imagen = req.body.imagen;
//     const anioPublicacion = req.body.anioPublicacion;
//     const categoriaId = req.body.categoriaId;
//     const autorId = req.body.autorId;
//     const editorialId = req.body.editorialId;

//     context.LibroModel.create({
//         nombre: nombre,
//         imagen: imagen,
//         anioPublicacion: anioPublicacion,
//         categoriaId: categoriaId,
//         autorId: autorId,
//         editorialId: editorialId,
//     })
//     .then(() => {
//          res.redirect("/libros/index");
//       })
//       .catch((err) => {
//         console.log("Error creando libro:", err);
//       })
// };

// export function GetEdit(req, res, next) {
//   const id = req.params.librosId;

//   context.LibroModel.findOne({ where: { id: id } })
//     .then((result) => {
//       if (!result) {
//         return res.redirect("/libros/index");
//       }

//       const librosList = result.dataValues;

//       return Promise.all([
//         context.CategoriaModel.findAll(),
//         context.AutorModel.findAll(),
//         context.EditorialModel.findAll()
//       ]).then(([categorias, autores, editoriales]) => {
//         res.render("libros/save", {
//           editMode: true,
//           librosList: librosList,
//           categorias: categorias.map((c) => c.dataValues),
//           autores: autores.map((a) => a.dataValues),
//           editoriales: editoriales.map((e) => e.dataValues),
//           "page-title": `Editar Libro: ${librosList.nombre}`
//         });
//       });
//     })
//     .catch((err) => {
//       console.log("Error cargando libro para editar:", err);
//     });
// }

// export function PostEdit (req, res, next) {
//     const id = req.body.librosId;
//     const nombre = req.body.nombre;
//     const imagen = req.body.imagen;
//     const anioPublicacion = req.body.anioPublicacion;
//     const categoriaId = req.body.categoriaId;
//     const autorId = req.body.autorId;
//     const editorialId = req.body.editorialId;

//     context.LibroModel.findOne({where: {id: id}})
//     .then((result) => {
//         if (!result) {
//             return res.redirect("libros/index");
//         }

//         context.LibroModel.update(
//             {
//                 nombre: nombre,
//                 imagen: imagen,
//                 anioPublicacion: anioPublicacion,
//                 categoriaId: categoriaId,
//                 autorId: autorId,
//                 editorialId: editorialId
//             },
//             {where: {id: id}}
//         ) 
//          .then(()=> {
//             return res.redirect("/libros/index")
//          })
//          .catch((err) => {
//             console.log("Error actualizando libro:", err);
//          })
//     })
//     .catch((err) => {
//         console.log("Error buscando libro", err);
//     })
// };

// export function Delete (req, res, next) {
//     const id = req.body.librosId;
    
//     context.LibroModel.findOne({where: {id: id}})
//     .then((result) => {
//         if (!result) {
//             return res.redirect("libros/index");
//         }
        
//         context.LibroModel.destroy({where: {id: id}}) 
//          .then(()=> {
//             return res.redirect("/libros/index")
//          })
//          .catch((err) => {
//             console.log("Error eliminando libro:", err);
//          })
//     })
//     .catch((err) => {
//         console.log("Error buscando libro", err);
//     })
// };
