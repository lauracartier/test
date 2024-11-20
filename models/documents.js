const { DataTypes } = require("sequelize");
const SEQUELIZE = require("../config/db");

const DOCUMENTS = SEQUELIZE.define('Documents', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    file: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
}, {
    tableName: 'Documents',
    timestamps: true,
});

module.exports = DOCUMENTS;