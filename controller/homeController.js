import context from "../context/appContext.js";

export async function GetHome(req, res, next) {
  const tituloFiltro = (req.query.titulo || "").toLowerCase().trim();
  const categoriasSeleccionadas = req.query.categorias || [];

  const categoriasFiltro = Array.isArray(categoriasSeleccionadas)
    ? categoriasSeleccionadas
    : [categoriasSeleccionadas];

  try {
    
    const [librosRaw, categoriasRaw,] = await Promise.all([
      context.LibroModel.findAll({
        include: [
          context.CategoriaModel,
          context.AutorModel,
          context.EditorialModel,
        ],
      }),
      context.CategoriaModel.findAll(),
      context.AutorModel.findAll(),
      context.EditorialModel.findAll()
    ]);

    const libros = librosRaw.map((l) => l.get({ plain: true }));
    const categorias = categoriasRaw.map((c) => c.get({ plain: true }));


let librosFiltrados = tituloFiltro
  ? libros.filter((libro) =>
      libro.nombre.toLowerCase().includes(tituloFiltro)
    )
  : libros;


if (categoriasFiltro.length > 0 && categoriasFiltro[0] !== "") {
  librosFiltrados = librosFiltrados.filter((libro) => {
    const categoriaId = libro.Categoria?.id?.toString(); // aseguramos que sea string
    return categoriaId && categoriasFiltro.includes(categoriaId);
  });
}

    res.render("home/home", {
      "page-title": "Inicio Libros",
      librosList: librosFiltrados,
      hasLibros: librosFiltrados.length > 0,
      categorias: categorias,
      categoriasFiltro: categoriasFiltro,
      tituloFiltro: tituloFiltro,
    });
  } catch (err) {
    console.error("Error en GetHome Libros:", err);
    res.status(500).render("errors/500", { error: "Error interno del servidor" });
  }
}

