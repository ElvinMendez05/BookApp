import context from "../context/appContext.js";

export async function GetIndex(req, res, next) {
  try {
    const result = await context.EditorialModel.findAll({
      include: [{ model: context.LibroModel }],
    });

    const editoriales = result.map((r) => r.get({ plain: true }));

    res.render("editoriales/index", {
      editorialesList: editoriales,
      hasEditoriales: editoriales.length > 0,
      "page-title": "Editorial list",
    });
  } catch (err) {
    console.error("Error fetching editoriales:", err);
  }
}

export async function GetCreate(req, res, next) {
  try {
    const result = await context.EditorialModel.findAll();
    const editoriales = result.map((r) => r.dataValues);

    res.render("editoriales/save", {
      editMode: false,
      editorialesList: editoriales,
      hasEditoriales: editoriales.length > 0,
      "page-title": "New Editoriales",
    });
  } catch (err) {
    console.error("Error fetching editoriales:", err);
  }
}

export async function PostCreate(req, res, next) {
  const { nombre, telefono, pais } = req.body;

  try {
    await context.EditorialModel.create({ nombre, telefono, pais });
    return res.redirect("/editoriales/index");
  } catch (err) {
    console.error("Error creating editoriales:", err);
  }
}

export async function GetEdit(req, res, next) {
  const id = req.params.editorialesId;

  try {
    const editorialResult = await context.EditorialModel.findOne({ where: { id } });

    if (!editorialResult) {
      return res.redirect("/editoriales/index");
    }

    const editorial = editorialResult.dataValues;
    const allEditoriales = await context.EditorialModel.findAll();
    const editorialesList = allEditoriales.map((r) => r.dataValues);

    res.render("editoriales/save", {
      editMode: true,
      editorial,
      editorialesList,
      hasEditoriales: editorialesList.length > 0,
      "page-title": `Edit Editorial: ${editorial.nombre}`,
    });
  } catch (err) {
    console.error("Error fetching editorial:", err);
  }
}

export async function PostEdit(req, res, next) {
  const { nombre, telefono, pais, editorialesId } = req.body;

  try {
    const editorial = await context.EditorialModel.findOne({ where: { id: editorialesId } });

    if (!editorial) {
      return res.redirect("/editoriales/index");
    }

    await context.EditorialModel.update(
      { nombre, telefono, pais },
      { where: { id: editorialesId } }
    );

    return res.redirect("/editoriales/index");
  } catch (err) {
    console.error("Error updating editorial:", err);
  }
}

export async function Delete(req, res, next) {
  const { editorialesId } = req.body;

  try {
    const editorial = await context.EditorialModel.findOne({ where: { id: editorialesId } });

    if (!editorial) {
      return res.redirect("/editoriales/index");
    }

    await context.EditorialModel.destroy({ where: { id: editorialesId } });

    return res.redirect("/editoriales/index");
  } catch (err) {
    console.error("Error deleting editorial:", err);
  }
}

// import context from "../context/appContext.js";

// export function GetIndex(req, res, next) {
//   context.EditorialModel.findAll({ include: [{ model: context.LibroModel }] })
//     .then((result) => {
//       const editoriales = result.map((result) => result.get({ plain: true }));    

//       res.render("editoriales/index", {
//         editorialesList: editoriales,
//         hasEditoriales: editoriales.length > 0,
//         "page-title": "Editorial list",
//       });
//     })
//     .catch((err) => {
//       console.error("Error fetching editoriales:", err);
//     });
// }

// export function GetCreate(req, res, next) {
//   context.EditorialModel.findAll()
//     .then((result) => {
//       const editoriales = result.map((result) => result.dataValues);

//       res.render("editoriales/save", {
//         editMode: false,
//         editorialesList: editoriales,
//         hasEditoriales: editoriales.length > 0,
//         "page-title": "New Editoriales",
//       });
//     })
//     .catch((err) => {
//       console.error("Error fetching editoriales", err);
//     }); 
// }

// export function PostCreate(req, res, next) {
//   const nombre = req.body.nombre;
//   const telefono = req.body.telefono; 
//   const pais = req.body.pais; 

//   context.EditorialModel.create({
//     nombre: nombre,
//     telefono: telefono,
//     pais: pais,
//   })
//     .then(() => {
//       return res.redirect("/editoriales/index");
//     })
//     .catch((err) => {
//       console.error("Error creating editoriales:", err);
//     });
// }

// export function GetEdit(req, res, next) {
//   const id = req.params.editorialesId;

//   context.EditorialModel.findOne({ where: { id: id } })
//     .then((result) => {
//       if (!result) {
//         return res.redirect("/editoriales/index");
//       }

//       const editorial = result.dataValues;

//       context.EditorialModel.findAll()
//         .then((result) => {
//           const editoriales = result.map((result) => result.dataValues);

//           res.render("editoriales/save", {
//             editMode: true,
//             editorial: editorial,
//             editorialesList: editoriales,
//             hasEditoriales: editoriales.length > 0,
//             "page-title": `Edit Editoriales ${editoriales.nombre}`,
//           });
//         })
//         .catch((err) => {
//           console.error("Error fetching editoriales:", err);
//         }); //promises
//     })
//     .catch((err) => {
//       console.error("Error fetching editoriales:", err);
//     });
// }

// export function PostEdit(req, res, next) {
//    const nombre = req.body.nombre;
//    const telefono = req.body.telefono; 
//    const pais = req.body.pais; 
//    const id = req.body.categoriasId;

//   context.EditorialModel.findOne({ where: { id: id } })
//     .then((result) => {
//       if (!result) {
//         return res.redirect("/editoriales/index");
//       }

//       // Update editoriales
//       context.EditorialModel.update(
//         {
//           nombre:nombre,
//           telefono: telefono,
//           pais: pais,
//         },
//         { where: { id: id } }
//       )
//         .then(() => {
//           return res.redirect("/editoriales/index");
//         })
//         .catch((err) => {
//           console.error("Error update editoriales:", err);
//         });
//     })
//     .catch((err) => {
//       console.error("Error fetching editoriales:", err);
//     });
// }

// export function Delete(req, res, next) {
//   const id = req.body.editorialesId;

//   context.EditorialModel.findOne({ where: { id: id } })
//     .then((result) => {
//       if (!result) {
//         return res.redirect("/editoriales/index");
//       }

      
//       context.EditorialModel.destroy({ where: { id: id } })
//         .then(() => {
//           return res.redirect("/editoriales/index");
//         })
//         .catch((err) => {
//           console.error("Error deleting editoriales:", err);
//         });
//     })
//     .catch((err) => {
//       console.error("Error fetching editoriales:", err);
//     });
// }
