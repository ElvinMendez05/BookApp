import context from "../context/appContext.js";

export async function GetIndex(req, res, next) {
  try {
    const result = await context.CategoriaModel.findAll({
      include: [{ model: context.LibroModel }],
    });

    const categorias = result.map((r) => r.get({ plain: true }));

    res.render("categorias/index", {
      categoriasList: categorias,
      hasCategorias: categorias.length > 0,
      "page-title": "Categoria list",
    });
  } catch (err) {
    console.error("Error fetching categorias:", err);
  }
}

export async function GetCreate(req, res, next) {
  try {
    const result = await context.CategoriaModel.findAll();
    const categorias = result.map((r) => r.dataValues);

    res.render("categorias/save", {
      editMode: false,
      categoriasList: categorias,
      hasCategorias: categorias.length > 0,
      "page-title": "New Categorias",
    });
  } catch (err) {
    console.error("Error fetching categorias:", err);
  }
}

export async function PostCreate(req, res, next) {
  const { nombre, descripcion } = req.body;

  try {
    await context.CategoriaModel.create({ nombre, descripcion });
    return res.redirect("/categorias/index");
  } catch (err) {
    console.error("Error creating categorias:", err);
  }
}

export async function GetEdit(req, res, next) {
  const id = req.params.categoriasId;

  try {
    const categoriaResult = await context.CategoriaModel.findOne({ where: { id } });

    if (!categoriaResult) {
      return res.redirect("/categorias/index");
    }

    const categoria = categoriaResult.dataValues;
    const allCategorias = await context.CategoriaModel.findAll();
    const categoriasList = allCategorias.map((r) => r.dataValues);

    res.render("categorias/save", {
      editMode: true,
      categoria,
      categoriasList,
      hasCategorias: categoriasList.length > 0,
      "page-title": `Edit Categoria: ${categoria.nombre}`,
    });
  } catch (err) {
    console.error("Error fetching categoria:", err);
  }
}

export async function PostEdit(req, res, next) {
  const { nombre, descripcion, categoriasId } = req.body;

  try {
    const categoria = await context.CategoriaModel.findOne({ where: { id: categoriasId } });

    if (!categoria) {
      return res.redirect("/categorias/index");
    }

    await context.CategoriaModel.update(
      { nombre, descripcion },
      { where: { id: categoriasId } }
    );

    return res.redirect("/categorias/index");
  } catch (err) {
    console.error("Error updating categoria:", err);
  }
}

export async function Delete(req, res, next) {
  const { categoriasId } = req.body;

  try {
    const categoria = await context.CategoriaModel.findOne({ where: { id: categoriasId } });

    if (!categoria) {
      return res.redirect("/categorias/index");
    }

    await context.CategoriaModel.destroy({ where: { id: categoriasId } });

    return res.redirect("/categorias/index");
  } catch (err) {
    console.error("Error deleting categoria:", err);
  }
}


// import context from "../context/appContext.js";

// export function GetIndex(req, res, next) {
//   context.CategoriaModel.findAll({ include: [{ model: context.LibroModel }] })
//     .then((result) => {
//       const categorias = result.map((result) => result.get({ plain: true }));    

//       res.render("categorias/index", {
//         categoriasList: categorias,
//         hasCategorias: categorias.length > 0,
//         "page-title": "Categoria list",
//       });
//     })
//     .catch((err) => {
//       console.error("Error fetching categorias:", err);
//     });
// }

// export function GetCreate(req, res, next) {
//   context.CategoriaModel.findAll()
//     .then((result) => {
//       const caretegorias = result.map((result) => result.dataValues);

//       res.render("categorias/save", {
//         editMode: false,
//         categoriasList: caretegorias,
//         hasCategorias: caretegorias.length > 0,
//         "page-title": "New Categorias",
//       });
//     })
//     .catch((err) => {
//       console.error("Error fetching categorias", err);
//     }); 
// }

// export function PostCreate(req, res, next) {
//   const nombre = req.body.nombre;
//   const descripcion = req.body.descripcion; 

//   context.CategoriaModel.create({
//     nombre: nombre,
//     descripcion: descripcion,
//   })
//     .then(() => {
//       return res.redirect("/categorias/index");
//     })
//     .catch((err) => {
//       console.error("Error creating categorias:", err);
//     });
// }

// export function GetEdit(req, res, next) {
//   const id = req.params.categoriasId;

//   context.CategoriaModel.findOne({ where: { id: id } })
//     .then((result) => {
//       if (!result) {
//         return res.redirect("/categorias/index");
//       }

//       const categoria = result.dataValues;

//       context.CategoriaModel.findAll()
//         .then((result) => {
//           const categorias = result.map((result) => result.dataValues);

//           res.render("categorias/save", {
//             editMode: true,
//             categoria: categoria,
//             categoriasList: categorias,
//             hasCategorias: categorias.length > 0,
//             "page-title": `Edit Categorias ${categorias.nombre}`,
//           });
//         })
//         .catch((err) => {
//           console.error("Error fetching categorias:", err);
//         }); //promises
//     })
//     .catch((err) => {
//       console.error("Error fetching categorias:", err);
//     });
// }

// export function PostEdit(req, res, next) {
//   const nombre = req.body.nombre;
//   const descripcion = req.body.descripcion;
//   const id = req.body.categoriasId;

//   context.CategoriaModel.findOne({ where: { id: id } })
//     .then((result) => {
//       if (!result) {
//         return res.redirect("/categorias/index");
//       }

//       // Update categorias
//       context.CategoriaModel.update(
//         {
//           nombre:nombre,
//           descripcion: descripcion,
//         },
//         { where: { id: id } }
//       )
//         .then(() => {
//           return res.redirect("/categorias/index");
//         })
//         .catch((err) => {
//           console.error("Error update categorias:", err);
//         });
//     })
//     .catch((err) => {
//       console.error("Error fetching categorias:", err);
//     });
// }

// export function Delete(req, res, next) {
//   const id = req.body.categoriasId;
//    console.log("Categoría a eliminar:", id);

//   context.CategoriaModel.findOne({ where: { id: id } })
//     .then((result) => {
//       if (!result) {
//         return res.redirect("/categorias/index");
//       }

      
//       context.CategoriaModel.destroy({ where: { id: id } })
//         .then(() => {
//           return res.redirect("/categorias/index");
//         })
//         .catch((err) => {
//           console.error("Error deleting categorias:", err);
//         });
//     })
//     .catch((err) => {
//       console.error("Error fetching categorias:", err);
//     });
// }
