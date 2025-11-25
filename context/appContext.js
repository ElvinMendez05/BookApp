import connection from "../utils/DbConnection.js";
import LibroModel from "../model/libroModel.js";
import AutorModel from "../model/autorModel.js"
import EditorialModel from "../model/editorialModel.js";
import CategoriaModel from "../model/categoriaModel.js";
import UserModel from "../model/UserModel.js";

try {
  await connection.authenticate(); // Authenticate the connection
  console.log("Database connection has been established successfully.");
} catch (err) {
  console.error("Error setting up the database connection:", err);
}

// Relaciones
CategoriaModel.hasMany(LibroModel, { foreignKey: 'categoriaId' });
LibroModel.belongsTo(CategoriaModel, { foreignKey: 'categoriaId' });

AutorModel.hasMany(LibroModel, { foreignKey: 'autorId' });
LibroModel.belongsTo(AutorModel, { foreignKey: 'autorId' });

EditorialModel.hasMany(LibroModel, { foreignKey: 'editorialId' });
LibroModel.belongsTo(EditorialModel, { foreignKey: 'editorialId' });

//User Relation 

UserModel.hasMany(LibroModel, { foreignKey: "userId" });
LibroModel.belongsTo(UserModel, { foreignKey: "userId" });

UserModel.hasMany(CategoriaModel, { foreignKey: "userId" });
CategoriaModel.belongsTo(UserModel, { foreignKey: "userId" });

UserModel.hasMany(AutorModel, { foreignKey: "userId" });
AutorModel.belongsTo(UserModel, { foreignKey: "userId" });

UserModel.hasMany(EditorialModel, { foreignKey: "userId" });
EditorialModel.belongsTo(UserModel, { foreignKey: "userId" });


 
export default {
  sequelize: connection,
  LibroModel,
  CategoriaModel,
  AutorModel,
  EditorialModel,
  user
};
