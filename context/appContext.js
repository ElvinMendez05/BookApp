import connection from "../utils/DbConnection.js";
import LibroModel from "../model/libroModel.js";
import AutorModel from "../model/autorModel.js"
import EditorialModel from "../model/editorialModel.js";
import CategoriaModel from "../model/categoriaModel.js";

try {
  await connection.authenticate(); // Authenticate the connection
  console.log("Database connection has been established successfully.");
} catch (err) {
  console.error("Error setting up the database connection:", err);
}

try {
  await connection.query("DROP TABLE IF EXISTS categorias_backup;");
  console.log("Tabla 'categorias_backup' eliminada correctamente.");
} catch (error) {
  console.error("Error al eliminar la tabla:", error);
}

// Relaciones
CategoriaModel.hasMany(LibroModel, { foreignKey: 'categoriaId' });
LibroModel.belongsTo(CategoriaModel, { foreignKey: 'categoriaId' });

AutorModel.hasMany(LibroModel, { foreignKey: 'autorId' });
LibroModel.belongsTo(AutorModel, { foreignKey: 'autorId' });

EditorialModel.hasMany(LibroModel, { foreignKey: 'editorialId' });
LibroModel.belongsTo(EditorialModel, { foreignKey: 'editorialId' });
 
export default {
  sequelize: connection,
  LibroModel,
  CategoriaModel,
  AutorModel,
  EditorialModel
};
