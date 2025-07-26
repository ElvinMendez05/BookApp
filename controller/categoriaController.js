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
