const { DataTypes } = require("sequelize");
const SEQUELIZE = require("../config/db");

const MEDIA = SEQUELIZE.define(
    "Media",
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
        image: {
            type: DataTypes.STRING(150),
            allowNull: true,
            validate: {
                checkImageOrVideo(value) {
                    if (value === null && this.video === null) {
                        throw new Error("Either 'image' or 'video' must be provided.");
                    }
                }
            }
        },
        video: {
            type: DataTypes.STRING(150),
            allowNull: true,
            validate: {
                checkImageOrVideo(value) {
                    if (value === null && this.image === null) {
                        throw new Error("Either 'image' or 'video' must be provided.");
                    }
                }
            }
        },
        date_media: {
            type: DataTypes.DATE,
            allowNull: false,
        }
    },
    {
        tableName: "Medias",
        timestamps: true,
        comment: "Table des informations liées aux médias",
    }
);

module.exports = MEDIA;
