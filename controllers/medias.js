const MEDIAS_MODEL = require("../models/medias");

exports.getAllMedias = async (req, res) => {
    try {
        const MEDIAS = await MEDIAS_MODEL.findAll();
        res.render("front/medias", { title: "Médias - Goélands",  page: "medias", medias: MEDIAS});
    } catch (error) {
        res.status(500).send("Erreur lors de la récupération des médias.");
    }
};