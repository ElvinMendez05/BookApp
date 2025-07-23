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
});

export default Autor;