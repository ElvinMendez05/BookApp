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
});

export default Categoria;