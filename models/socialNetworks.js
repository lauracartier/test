const { DataTypes } = require("sequelize");
const SEQUELIZE = require("../config/db");
const CLUB = require("./club");

const SOCIAL_NETWORKS = SEQUELIZE.define(
    "Social_Networks",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(25),
            allowNull: false,
        },
        link: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        club_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: CLUB,
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
    },
    {
        tableName: "Social_Networks",
        timestamps: true,
        comment: "Table des réseaux sociaux du club",
    }
);

module.exports = SOCIAL_NETWORKS;
