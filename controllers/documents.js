const DOCUMENTS_MODEL = require("../models/documents");

exports.getDocuments = async (req, res) => {
    try {
        const DOCUMENTS = await DOCUMENTS_MODEL.findAll();
        res.render("front/inscription", { title: "Inscription - Goélands",  page: "inscription", documents: DOCUMENTS});
    } catch (error) {
        res.status(500).send(error);
    }
};