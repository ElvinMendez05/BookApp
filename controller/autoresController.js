import context from "../context/appContext.js";

export async function GetIndex(req, res, next) {
  try {
    const result = await context.AutorModel.findAll({
      include: [{ model: context.LibroModel }],
    });

    const autores = result.map((r) => r.get({ plain: true }));

    res.render("autores/index", {
      autoresList: autores,
      hasAutores: autores.length > 0,
      "page-title": "Autores list",
    });
  } catch (err) {
    console.error("Error fetching autores:", err);
  }
}

export async function GetCreate(req, res, next) {
  try {
    const result = await context.AutorModel.findAll();
    const autores = result.map((r) => r.dataValues);

    res.render("autores/save", {
      editMode: false,
      autoresList: autores,
      hasAutores: autores.length > 0,
      "page-title": "New Autores",
    });
  } catch (err) {
    console.error("Error fetching autores:", err);
  }
}

export async function PostCreate(req, res, next) {
  const { nombre, correo } = req.body;

  try {
    await context.AutorModel.create({ nombre, correo });
    return res.redirect("/autores/index");
  } catch (err) {
    console.error("Error creating autor:", err);
  }
}

export async function GetEdit(req, res, next) {
  const id = req.params.autoresId;

  try {
    const autorResult = await context.AutorModel.findOne({ where: { id } });

    if (!autorResult) {
      return res.redirect("/autores/index");
    }

    const autor = autorResult.dataValues;
    const allAutores = await context.AutorModel.findAll();
    const autoresList = allAutores.map((r) => r.dataValues);

    res.render("autores/save", {
      editMode: true,
      autor,
      autoresList,
      hasAutores: autoresList.length > 0,
      "page-title": `Edit Autor: ${autor.nombre}`,
    });
  } catch (err) {
    console.error("Error loading autor for edit:", err);
  }
}

export async function PostEdit(req, res, next) {
  const { nombre, correo, autoresId } = req.body;

  try {
    const autor = await context.AutorModel.findOne({ where: { id: autoresId } });

    if (!autor) {
      return res.redirect("/autores/index");
    }

    await context.AutorModel.update(
      { nombre, correo },
      { where: { id: autoresId } }
    );

    return res.redirect("/autores/index");
  } catch (err) {
    console.error("Error updating autor:", err);
  }
}

export async function Delete(req, res, next) {
  const { autoresId } = req.body;

  try {
    const autor = await context.AutorModel.findOne({ where: { id: autoresId } });

    if (!autor) {
      return res.redirect("/autores/index");
    }

    await context.AutorModel.destroy({ where: { id: autoresId } });

    return res.redirect("/autores/index");
  } catch (err) {
    console.error("Error deleting autor:", err);
  }
}


// import context from "../context/appContext.js";

// export function GetIndex(req, res, next) {
//   context.AutorModel.findAll({ include: [{ model: context.LibroModel }] })
//     .then((result) => {
//       const autores = result.map((result) => result.get({ plain: true }));    

//       res.render("autores/index", {
//         autoresList: autores,
//         hasAutores: autores.length > 0,
//         "page-title": "Autores list",
//       });
//     })
//     .catch((err) => {
//       console.error("Error fetching autores:", err);
//     });
// }

// export function GetCreate(req, res, next) {
//   context.AutorModel.findAll()
//     .then((result) => {
//       const autores = result.map((result) => result.dataValues);

//       res.render("autores/save", {
//         editMode: false,
//         autoresList: autores,
//         hasAutores: autores.length > 0,
//         "page-title": "New Autores",
//       });
//     })
//     .catch((err) => {
//       console.error("Error fetching autores", err);
//     }); 
// }

// export function PostCreate(req, res, next) {
//   const nombre = req.body.nombre;
//   const correo = req.body.correo; 

//   context.AutorModel.create({
//     nombre: nombre,
//     correo: correo,
//   })
//     .then(() => {
//       return res.redirect("/autores/index");
//     })
//     .catch((err) => {
//       console.error("Error creating autores:", err);
//     });
// }

// export function GetEdit(req, res, next) {
//   const id = req.params.autoresId;

//   context.AutorModel.findOne({ where: { id: id } })
//     .then((result) => {
//       if (!result) {
//         return res.redirect("/autores/index");
//       }

//       const autor = result.dataValues;

//       context.AutorModel.findAll()
//         .then((result) => {
//           const autores = result.map((result) => result.dataValues);

//           res.render("autores/save", {
//             editMode: true,
//             autor: autor,
//            autoresList: autores,
//             hasAutores: autores.length > 0,
//             "page-title": `Edit Autores ${autores.nombre}`,
//           });
//         })
//         .catch((err) => {
//           console.error("Error fetching autores:", err);
//         }); //promises
//     })
//     .catch((err) => {
//       console.error("Error fetching autores:", err);
//     });
// }

// export function PostEdit(req, res, next) {
//   const nombre = req.body.nombre;
//   const correo = req.body.correo;
//   const id = req.body.categoriasId;

//   context.AutorModel.findOne({ where: { id: id } })
//     .then((result) => {
//       if (!result) {
//         return res.redirect("/autores/index");
//       }
//       // Update autores
//       context.AutorModel.update(
//         {
//           nombre:nombre,
//           correo: correo,
//         },
//         { where: { id: id } }
//       )
//         .then(() => {
//           return res.redirect("/autores/index");
//         })
//         .catch((err) => {
//           console.error("Error update autores:", err);
//         });
//     })
//     .catch((err) => {
//       console.error("Error fetching autores:", err);
//     });
// }

// export function Delete(req, res, next) {
//   const id = req.body.autoresId;

//   context.AutorModel.findOne({ where: { id: id } })
//     .then((result) => {
//       if (!result) {
//         return res.redirect("/autores/index");
//       }

//       context.AutorModel.destroy({ where: { id: id } })
//         .then(() => {
//           return res.redirect("/autores/index");
//         })
//         .catch((err) => {
//           console.error("Error deleting autores:", err);
//         });
//     })
//     .catch((err) => {
//       console.error("Error fetching autores:", err);
//     });
// }
