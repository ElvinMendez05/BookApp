import context from "../context/appContext.js";

export function GetIndex(req, res, next) {
  context.CategoriaModel.findAll({ include: [{ model: context.LibroModel }] })
    .then((result) => {
      const categorias = result.map((result) => result.get({ plain: true }));    

      res.render("categorias/index", {
        categoriasList: categorias,
        hasCategorias: categorias.length > 0,
        "page-title": "Categoria list",
      });
    })
    .catch((err) => {
      console.error("Error fetching categorias:", err);
    });
}

export function GetCreate(req, res, next) {
  context.CategoriaModel.findAll()
    .then((result) => {
      const caretegorias = result.map((result) => result.dataValues);

      res.render("categorias/save", {
        editMode: false,
        categoriasList: caretegorias,
        hasCategorias: caretegorias.length > 0,
        "page-title": "New Categorias",
      });
    })
    .catch((err) => {
      console.error("Error fetching categorias", err);
    }); 
}

export function PostCreate(req, res, next) {
  const nombre = req.body.nombre;
  const descripcion = req.body.descripcion; 

  context.CategoriaModel.create({
    nombre: nombre,
    descripcion: descripcion,
  })
    .then(() => {
      return res.redirect("/categorias/index");
    })
    .catch((err) => {
      console.error("Error creating categorias:", err);
    });
}

export function GetEdit(req, res, next) {
  const id = req.params.categoriasId;

  context.CategoriaModel.findOne({ where: { id: id } })
    .then((result) => {
      if (!result) {
        return res.redirect("/categorias/index");
      }

      const categoria = result.dataValues;

      context.CategoriaModel.findAll()
        .then((result) => {
          const categorias = result.map((result) => result.dataValues);

          res.render("categorias/save", {
            editMode: true,
            categoria: categoria,
            categoriasList: categorias,
            hasCategorias: categorias.length > 0,
            "page-title": `Edit Categorias ${categorias.nombre}`,
          });
        })
        .catch((err) => {
          console.error("Error fetching categorias:", err);
        }); //promises
    })
    .catch((err) => {
      console.error("Error fetching categorias:", err);
    });
}

export function PostEdit(req, res, next) {
  const nombre = req.body.nombre;
  const descripcion = req.body.descripcion;
  const id = req.body.categoriasId;

  context.CategoriaModel.findOne({ where: { id: id } })
    .then((result) => {
      if (!result) {
        return res.redirect("/categorias/index");
      }

      // Update categorias
      context.CategoriaModel.update(
        {
          nombre:nombre,
          descripcion: descripcion,
        },
        { where: { id: id } }
      )
        .then(() => {
          return res.redirect("/categorias/index");
        })
        .catch((err) => {
          console.error("Error update categorias:", err);
        });
    })
    .catch((err) => {
      console.error("Error fetching categorias:", err);
    });
}

export function Delete(req, res, next) {
  const id = req.body.categoriasId;

  context.CategoriaModel.findOne({ where: { id: id } })
    .then((result) => {
      if (!result) {
        return res.redirect("/categorias/index");
      }

      
      context.CategoriaModel.destroy({ where: { id: id } })
        .then(() => {
          return res.redirect("/categorias/index");
        })
        .catch((err) => {
          console.error("Error deleting categorias:", err);
        });
    })
    .catch((err) => {
      console.error("Error fetching categorias:", err);
    });
}
