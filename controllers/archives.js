const ACTUALITY_MODEL = require("../models/actuality");
const SEASON_MODEL = require("../models/season");
const truncate = require('html-truncate');

exports.getPresseArchives = async (req, res) => {
    try {

        const ACTUALITIES = await ACTUALITY_MODEL.findAll({
            include: [
                {
                    model: SEASON_MODEL,
                    as: 'season',
                    where: { active: false },
                    attributes: ['date_debut', 'date_fin'],
                }
            ],
            order: [['id', 'DESC']],
        });

        // Troncature de chaque description
        const truncatedActualities = ACTUALITIES.map(actuality => {
            return {
                ...actuality.toJSON(),
                description: truncate(actuality.description, 500)
            };
        });

        res.render("front/archives", {
            title: "Archives - Goélands",
            actualities: truncatedActualities,
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des actualités:", error);
        res.status(500).send("Erreur lors de la récupération des actualités.");
    }
};
