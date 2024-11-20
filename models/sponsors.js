const { DataTypes } = require("sequelize");
const SEQUELIZE = require("../config/db");

const SPONSOR = SEQUELIZE.define('Sponsor', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(25),
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    link: {
        type: DataTypes.STRING(150),
        allowNull: true,
    },
}, {
    tableName: 'Sponsors',
    timestamps: true,
});

module.exports = SPONSOR;