const SOCIAL_NETWORK_MODEL = require("../../models/socialNetworks");

// Afficher tous les réseaux
exports.getAllNetworks = async (req, res) => {
    try {
        const SOCIAL_NETWORKS = await SOCIAL_NETWORK_MODEL.findAll({
            order: [['id', 'DESC']]
        });
        res.render("admin/social_networks/index", { title: "Réseaux sociaux", reseaux: SOCIAL_NETWORKS });
    } catch (error) {
        res.status(500).send("Erreur lors de la récupération des reseaux sociaux.");
    }
};

// Afficher le formulaire pour ajouter un nouveau reseaux
exports.getNewNetworkForm = (req, res) => {
    res.render("admin/social_networks/create", { title: "Réseaux sociaux" });
};

// Créer un reseau
exports.createNetwork = async (req, res) => {
    try {
        const { name, link } = req.body;

        await SOCIAL_NETWORK_MODEL.create({ name, link, club_id: 1 });
        res.redirect("/admin/reseaux?status=created");
    } catch (error) {
        res.status(500).send("Erreur lors de la création du reseau social.");
    }
};

// Afficher le formulaire pour modifier un reseau existant
exports.getEditNetworkForm = async (req, res) => {
    try {
        const { id } = req.params;
        const RESEAU = await SOCIAL_NETWORK_MODEL.findByPk(id);
        if (!RESEAU) return res.status(404).send("Réseaux social non trouvé.");

        res.render("admin/social_networks/edit", { title: "Réseaux sociaux", reseau: RESEAU });
    } catch (error) {
        res.status(500).send("Erreur lors de la récupération du reseau social.");
    }
};

// Mettre à jour un reseau 
exports.updateNetwork = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, link } = req.body;
        const RESEAU = await SOCIAL_NETWORK_MODEL.findByPk(id);

        if (!RESEAU) return res.status(404).send("Réseau social non trouvé.");

        await RESEAU.update({ name, link, club_id: 1 });
        res.redirect("/admin/reseaux?status=edited");
    } catch (error) {
        res.status(500).send("Erreur lors de la mise à jour du réseau social.");
    }
};

// Supprimer un reseau Social
exports.deleteNetwork = async (req, res) => {
    try {
        const { id } = req.params;
        const RESEAU = await SOCIAL_NETWORK_MODEL.findByPk(id);

        if (!RESEAU) return res.status(404).send("Réseau social non trouvé.");

        await RESEAU.destroy({ where: { id } });
        res.redirect("/admin/reseaux?status=deleted");
    } catch (error) {
        res.status(500).send("Erreur lors de la suppression du reseaux social.");
    }
};
