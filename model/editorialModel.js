import connection from "../utils/DbConnection.js";
import { DataTypes } from "sequelize";

const Editorial = connection.define("editoriales", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pais: {
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

export default Editorial;