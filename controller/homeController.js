import context from "../context/appContext.js";

export async function GetHome(req, res, next) {
  const tituloFiltro = (req.query.titulo || "").toLowerCase().trim();
  const categoriasSeleccionadas = req.query.categorias || [];

  // Normalizamos categoriasFiltro para que siempre sea un array
  const categoriasFiltro = Array.isArray(categoriasSeleccionadas)
    ? categoriasSeleccionadas
    : [categoriasSeleccionadas];

  try {
    // Cargar libros con relaciones y categorías en paralelo
    const [librosRaw, categoriasRaw] = await Promise.all([
      context.LibroModel.findAll({
        include: [
          context.CategoriaModel,
          context.AutorModel,
          context.EditorialModel,
        ],
      }),
      context.CategoriaModel.findAll(),
    ]);

    // Convertir resultados a objetos planos
    const libros = librosRaw.map((l) => l.get({ plain: true }));
    const categorias = categoriasRaw.map((c) => c.get({ plain: true }));

    // Filtrar por título (case-insensitive)
    let librosFiltrados = tituloFiltro
      ? libros.filter((libro) =>
          libro.nombre.toLowerCase().includes(tituloFiltro)
        )
      : libros;

    // Filtrar por categorías seleccionadas (si no están vacías)
    if (categoriasFiltro.length > 0 && categoriasFiltro[0] !== "") {
      librosFiltrados = librosFiltrados.filter((libro) =>
        categoriasFiltro.includes(String(libro.Categoria?.id))
      );
    }

    // Renderizar vista
    res.render("home/home", {
      "page-title": "Inicio Libros",
      librosList: librosFiltrados,
      hasLibros: librosFiltrados.length > 0,
      categorias,
      categoriasSeleccionadas: categoriasFiltro,
      tituloFiltro,
    });
  } catch (err) {
    console.error("Error en GetHome Libros:", err);
    res.status(500).render("errors/500", { error: "Error interno del servidor" });
  }
}
