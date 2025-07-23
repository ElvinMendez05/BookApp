import connection from "../utils/DbConnection.js";
import LibroModel from "../model/libroModel.js";
import AutorModel from "../model/autorModel.js"
import EditorialModel from "../model/editorialModel.js";
import CategoriaModel from "../model/categoriaModel.js";

connection.authenticate()
  .then(() => {
    console.log("Database connection has been established successfully");
  })
  .catch((error) => {
    console.error("Unable to connect to the database", error);
  });

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
