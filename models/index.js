const SEQUELIZE = require('../config/db');
const CLUB = require("./club");
const DOCUMENTS = require('./documents');
const SOCIAL_NETWORKS = require("./socialNetworks");
const SPONSORS = require("./sponsors");
const ACTUALITY = require("./actuality"); // Import du modèle Actuality
const SEASON = require("./season"); // Import du modèle Saison

// Fonction pour synchroniser les modèles dans l'ordre correct
async function syncModels() {
    try {
        await SEQUELIZE.sync({ alter: true });
        console.log('Toutes les tables ont été synchronisées avec succès.');
    } catch (error) {
        console.error('Erreur lors de la synchronisation de la base de données:', error);
    }
}

// Définition des relations
CLUB.hasMany(SOCIAL_NETWORKS, {
    foreignKey: "club_id",
    as: "socialNetworks",
});

SOCIAL_NETWORKS.belongsTo(CLUB, {
    foreignKey: "club_id",
    as: "club",
});

SEASON.hasMany(ACTUALITY, {
    foreignKey: "season_id",
    as: "actualities",
});

ACTUALITY.belongsTo(SEASON, {
    foreignKey: "season_id",
    as: "season",
});

// Appel de la fonction pour synchroniser
syncModels();

// Exporter l'instance Sequelize et les modèles
module.exports = {
    sequelize: SEQUELIZE,
    CLUB,
    SOCIAL_NETWORKS,
    SPONSORS,
    DOCUMENTS,
    ACTUALITY,
    SEASON
};
