const { DataTypes } = require("sequelize");
const SEQUELIZE = require("../config/db");

const ACTUALITY = SEQUELIZE.define(
    "Actuality",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        subtitle: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        season_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "season",
                key: "id",
            },
        },
        date_actuality: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        image: {
            type: DataTypes.JSON,
            allowNull: true,
        },
    },
    {
        tableName: "Actuality",
        timestamps: true,
        comment: "Table des actualités",
    }
);

module.exports = ACTUALITY;
