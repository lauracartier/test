const ACTUALITY_MODEL = require("../../models/actuality");
const SEASON_MODEL = require("../../models/season");

// Afficher toutes les actualités
exports.getAllActualitiesArchives = async (req, res) => {
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

        res.render("admin/actualities/index", {
            title: "Actualités archivées",
            actualities: ACTUALITIES,
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des actualités archivées:", error);
        res.status(500).send("Erreur lors de la récupération des actualités archivées.");
    }
};
