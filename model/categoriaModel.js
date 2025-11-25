import connection from "../utils/DbConnection.js";
import { DataTypes } from "sequelize";

const Categoria = connection.define("categorias", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
    descripcion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
   userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users", // Name of the referenced model
        key: "id", // Key in the referenced model
      },
      onDelete: "CASCADE", // Optional: define behavior on delete
      onUpdate: "CASCADE", // Optional: define behavior on update
    },
});

export default Categoria;