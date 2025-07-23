import context from "../context/appContext.js";

export function GetIndex(req, res, next) {
  context.EditorialModel.findAll({ include: [{ model: context.LibroModel }] })
    .then((result) => {
      const editoriales = result.map((result) => result.get({ plain: true }));    

      res.render("editoriales/index", {
        editorialesList: editoriales,
        hasEditoriales: editoriales.length > 0,
        "page-title": "Editorial list",
      });
    })
    .catch((err) => {
      console.error("Error fetching editoriales:", err);
    });
}

export function GetCreate(req, res, next) {
  context.EditorialModel.findAll()
    .then((result) => {
      const editoriales = result.map((result) => result.dataValues);

      res.render("editoriales/save", {
        editMode: false,
        editorialesList: editoriales,
        hasEditoriales: editoriales.length > 0,
        "page-title": "New Editoriales",
      });
    })
    .catch((err) => {
      console.error("Error fetching editoriales", err);
    }); 
}

export function PostCreate(req, res, next) {
  const nombre = req.body.nombre;
  const telefono = req.body.telefono; 
  const pais = req.body.pais; 

  context.EditorialModel.create({
    nombre: nombre,
    telefono: telefono,
    pais: pais,
  })
    .then(() => {
      return res.redirect("/editoriales/index");
    })
    .catch((err) => {
      console.error("Error creating editoriales:", err);
    });
}

export function GetEdit(req, res, next) {
  const id = req.params.editorialesId;

  context.EditorialModel.findOne({ where: { id: id } })
    .then((result) => {
      if (!result) {
        return res.redirect("/editoriales/index");
      }

      const editorial = result.dataValues;

      context.EditorialModel.findAll()
        .then((result) => {
          const editoriales = result.map((result) => result.dataValues);

          res.render("editoriales/save", {
            editMode: true,
            editorial: editorial,
            editorialesList: editoriales,
            hasEditoriales: editoriales.length > 0,
            "page-title": `Edit Editoriales ${editoriales.nombre}`,
          });
        })
        .catch((err) => {
          console.error("Error fetching editoriales:", err);
        }); //promises
    })
    .catch((err) => {
      console.error("Error fetching editoriales:", err);
    });
}

export function PostEdit(req, res, next) {
   const nombre = req.body.nombre;
   const telefono = req.body.telefono; 
   const pais = req.body.pais; 
   const id = req.body.categoriasId;

  context.EditorialModel.findOne({ where: { id: id } })
    .then((result) => {
      if (!result) {
        return res.redirect("/editoriales/index");
      }

      // Update editoriales
      context.EditorialModel.update(
        {
          nombre:nombre,
          telefono: telefono,
          pais: pais,
        },
        { where: { id: id } }
      )
        .then(() => {
          return res.redirect("/editoriales/index");
        })
        .catch((err) => {
          console.error("Error update editoriales:", err);
        });
    })
    .catch((err) => {
      console.error("Error fetching editoriales:", err);
    });
}

export function Delete(req, res, next) {
  const id = req.body.editorialesId;

  context.EditorialModel.findOne({ where: { id: id } })
    .then((result) => {
      if (!result) {
        return res.redirect("/editoriales/index");
      }

      
      context.EditorialModel.destroy({ where: { id: id } })
        .then(() => {
          return res.redirect("/editoriales/index");
        })
        .catch((err) => {
          console.error("Error deleting editoriales:", err);
        });
    })
    .catch((err) => {
      console.error("Error fetching editoriales:", err);
    });
}
