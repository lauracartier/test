const { DataTypes } = require("sequelize");
const SEQUELIZE = require("../config/db");

const CLUB = SEQUELIZE.define(
    "Club",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        adress: {
            type: DataTypes.STRING(25),
            allowNull: false,
        },
        addressDetails: {
            type: DataTypes.STRING(25),
            allowNull: true,
        },
        cp: {
            type: DataTypes.STRING(5),
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING(15),
            allowNull: true,
        },
        mail: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        committee_image: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        room_image: {
            type: DataTypes.STRING(100),
            allowNull: true,
        }
    },
    {
        tableName: "Club",
        timestamps: true,
        comment: "Table des informations liées au club",
    }
);

module.exports = CLUB;
