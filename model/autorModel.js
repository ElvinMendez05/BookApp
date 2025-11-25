import connection from "../utils/DbConnection.js";
import { DataTypes } from "sequelize";

const Autor = connection.define("autores", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  correo: {
  type: DataTypes.STRING,
  allowNull: false,
  
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

export default Autor;