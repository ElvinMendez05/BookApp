import path from "path";
import fs from "fs";
import context from "../context/appContext.js";
import { sendEmail } from "../services/EmailServices.js";
import { projectRoot } from "../utils/paths.js"; 


export async function GetIndex(req, res, next) {
  try {
    const result = await context.LibroModel.findAll({
      include: [
        { model: context.CategoriaModel},
        { model: context.AutorModel},
        { model: context.EditorialModel},
      ],
    });

    const libros = result.map((r) => r.get({ plain: true }));

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
  const { nombre, anioPublicacion, categoriaId, autorId, editorialId } = req.body;
  const imagenFile = req.file;

  try {
    const imagen = imagenFile ? "\\" + path.relative("public", imagenFile.path) : null;

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
      html: `<p>Un nuevo libro ha sido creado:</p>
             <p><strong>Nombre:</strong> ${nombre}</p>
             <p><strong>Autor:</strong> ${AutorModel.nombre}</p>`,
    });

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
  const { librosId, nombre, anioPublicacion, categoriaId, autorId, editorialId } = req.body;
  const imagenFile = req.file;

  try {
    const libro = await context.LibroModel.findOne({ where: { id: librosId } });

    if (!libro) {
      return res.redirect("/libros/index");
    }

    let nuevaRutaImagen = libro.imagen;

    if (imagenFile) {
      const nuevaRuta = "\\" + path.relative("public", imagenFile.path);

  
      const imagenAnterior = path.join(projectRoot, "public", libro.imagen || "");
      if (libro.imagen && fs.existsSync(imagenAnterior)) {
        fs.unlinkSync(imagenAnterior);
      }

      nuevaRutaImagen = nuevaRuta;
    }

    await context.LibroModel.update(
      {
        nombre,
        imagen: nuevaRutaImagen,
        anioPublicacion,
        categoriaId,
        autorId,
        editorialId,
      },
      { where: { id: librosId } }
    );

    res.redirect("/libros/index");
  } catch (err) {
    console.error("Error actualizando libro:", err);
  }
}

export async function Delete(req, res, next) {
  const id = req.body.librosId;

  try {
    const libro = await context.LibroModel.findOne({ where: { id } });

    if (!libro) {
      return res.redirect("/libros/index");
    }

    // Eliminar archivo de imagen si existe
    if (libro.imagen) {
      const imagenPath = path.join(projectRoot, "public", libro.imagen);
      if (fs.existsSync(imagenPath)) {
        fs.unlinkSync(imagenPath);
      }
    }

    await context.LibroModel.destroy({ where: { id } });

    res.redirect("/libros/index");
  } catch (err) {
    console.error("Error eliminando libro:", err);
  }
}

export async function GetDetalle(req, res, next) {
  const id = req.params.id; 

  try {
    const libroResult = await context.LibroModel.findOne({
      where: { id },
      include: [
        context.CategoriaModel,
        context.AutorModel,
        {
          model: context.EditorialModel,
          attributes: ['nombre', 'pais', 'telefono'],
        },
      ],
    });

    if (!libroResult) {
      return res.status(404).render("errors/404", { error: "Libro no encontrado" });
    }

    const libro = libroResult.get({ plain: true });

    res.render("home/detalle", {
      "page-title": `Detalle del libro: ${libro.nombre}`,
      libro,
    });
  } catch (err) {
    console.error("Error en GetDetalle Libro:", err);
    res.status(500).render("errors/500", { error: "Error interno del servidor" });
  }
}


