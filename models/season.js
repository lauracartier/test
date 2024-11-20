const { DataTypes } = require("sequelize");
const SEQUELIZE = require("../config/db");

const SEASON = SEQUELIZE.define(
    "Season",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        date_debut: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        date_fin: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        tableName: "season",
        timestamps: true,
        comment: "Table des season, automatiquement archivée après le délai dépassé",
    }
);

module.exports = SEASON;
