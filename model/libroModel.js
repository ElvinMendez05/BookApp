import connection from "../utils/DbConnection.js";
import { DataTypes } from "sequelize";

const Libros = connection.define("Libros", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    nombre: { 
        type: DataTypes.STRING,
        allowNull: false,
    },
    imagen: { 
        type: DataTypes.STRING,
        allowNull: false,
    },
    anioPublicacion: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    categoriaId: { // FK a Categoría
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "categorias",
            key: "id",
        },
        onDelete: "CASCADE", // Optional: define behavior on delete
        onUpdate: "CASCADE", 
    },
    autorId: { // FK a Autor
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "autores",
            key: "id",
        },
        onDelete: "CASCADE", // Optional: define behavior on delete
        onUpdate: "CASCADE", 
    },
    editorialId: { // FK a Editorial
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "editoriales",
            key: "id",
        },
        onDelete: "CASCADE", // Optional: define behavior on delete
        onUpdate: "CASCADE", 
    },
}, {
    tableName: "libros",
});

export default Libros;