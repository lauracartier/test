const ACTUALITY_MODEL = require("../models/actuality");
const SEASON_MODEL = require("../models/season");
const truncate = require('html-truncate');

exports.getPresse = async (req, res) => {
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
                description: truncate(actuality.description, 500)
            };
        });

        res.render("front/presse", {
            title: "Presse - Goélands",
            actualities: truncatedActualities,
            season: `Saison ${ACTIVE_SEASON.date_debut.getFullYear()} - ${ACTIVE_SEASON.date_fin.getFullYear()}`
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des actualités:", error);
        res.status(500).send("Erreur lors de la récupération des actualités.");
    }
};

exports.getPresseById = async (req, res) => {
    try {
        const { id } = req.params;

        const ACTUALITY = await ACTUALITY_MODEL.findOne({
            where: { id: id },
            include: [{ model: SEASON_MODEL, as: 'season', attributes: ['date_debut', 'date_fin'] }]
        });
        if (!ACTUALITY) {
            return res.status(404).send("L'article demandé n'a pas été trouvé.");
        }

        console.log(ACTUALITY);
        res.render("front/presse_id", {
            title: "Presse - Goélands",
            actuality: ACTUALITY,
            images: ACTUALITY.image ? JSON.parse(ACTUALITY.image) : null,
        });
    } catch (error) {
        console.error("Erreur lors de la récupération de l'actualité:", error);
        res.status(500).send("Erreur lors de la récupération de l'actualité.");
    }
};
