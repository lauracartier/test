const ACTUALITY_MODEL = require("../models/actuality");
const SEASON_MODEL = require("../models/season");
const truncate = require('html-truncate');

exports.getInfos = async (req, res) => {
    try {
        const ACTIVE_SEASON = await SEASON_MODEL.findOne({ where: { active: true } });

        if (!ACTIVE_SEASON) {
            return res.status(400).send("Aucune saison active n'a été trouvée.");
        }

        const ACTUALITIES = await ACTUALITY_MODEL.findAll({
            where: { season_id: ACTIVE_SEASON.id },
            order: [['id', 'DESC']],
            include: [{ model: SEASON_MODEL, as: 'season', attributes: ['date_debut', 'date_fin'] }]
        });

        // Troncature de chaque description
        const truncatedActualities = ACTUALITIES.map(actuality => {
            return {
                ...actuality.toJSON(),
                description: truncate(actuality.description, 500) // Tronquer à 300 caractères
            };
        });

        res.render("front/home", {
            title: "Goélands",
            actualities: truncatedActualities,
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des actualités:", error);
        res.status(500).send("Erreur lors de la récupération des actualités.");
    }
};
