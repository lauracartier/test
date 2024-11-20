const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();
const SPONSORS_CONTROLLER = require("../controllers/admin/sponsors");
const MEDIAS_CONTROLLER = require("../controllers/admin/medias");
const DOCUMENTS_CONTROLLER = require("../controllers/admin/documents");
const SOCIAL_NETWORKS_CONTROLLER = require("../controllers/admin/socialNetworks");
const ACTUALITIES_CONTROLLER = require("../controllers/admin/actualities");
const ARCHIVES_CONTROLLER = require("../controllers/admin/archives");
const CLUB_CONTROLLER = require("../controllers/admin/club");

// Middleware pour définir le layout spécifique pour les routes admin
ROUTER.use((req, res, next) => {
    res.locals.layout = "admin/layout";
    next();
});

// HOME
ROUTER.get("/", (req, res) => {
    res.render("admin/home", {
        title: "Admin"
    });
});

// Route pour afficher tous les Réseaux sociaux
ROUTER.get('/reseaux', SOCIAL_NETWORKS_CONTROLLER.getAllNetworks);
ROUTER.get('/reseaux/create', SOCIAL_NETWORKS_CONTROLLER.getNewNetworkForm);
ROUTER.post('/reseaux/create', SOCIAL_NETWORKS_CONTROLLER.createNetwork);
ROUTER.get('/reseaux/edit/:id', SOCIAL_NETWORKS_CONTROLLER.getEditNetworkForm);
ROUTER.post('/reseaux/edit/:id', SOCIAL_NETWORKS_CONTROLLER.updateNetwork);
ROUTER.post('/reseaux/delete/:id', SOCIAL_NETWORKS_CONTROLLER.deleteNetwork);

// Route pour afficher tous les sponsors
ROUTER.get('/sponsors', SPONSORS_CONTROLLER.getAllSponsors);
ROUTER.get('/sponsors/create', SPONSORS_CONTROLLER.getNewSponsorForm);
ROUTER.post('/sponsors/create', SPONSORS_CONTROLLER.uploadImage, SPONSORS_CONTROLLER.createSponsor);
ROUTER.get('/sponsors/edit/:id', SPONSORS_CONTROLLER.getEditSponsorForm);
ROUTER.post('/sponsors/edit/:id', SPONSORS_CONTROLLER.uploadImage, SPONSORS_CONTROLLER.updateSponsor);
ROUTER.post('/sponsors/delete/:id', SPONSORS_CONTROLLER.deleteSponsor);

// Routes pour les actualités
ROUTER.get('/actualities', ACTUALITIES_CONTROLLER.getAllActualities);
ROUTER.get('/actualities/create', ACTUALITIES_CONTROLLER.getNewActualityForm);
ROUTER.post('/actualities/upload', ACTUALITIES_CONTROLLER.uploadImages);
ROUTER.post('/actualities/create', ACTUALITIES_CONTROLLER.createActuality);
ROUTER.get('/actualities/edit/:id', ACTUALITIES_CONTROLLER.getEditActualityForm);
ROUTER.post('/actualities/edit/:id', ACTUALITIES_CONTROLLER.updateActuality);
ROUTER.post('/actualities/delete/:id', ACTUALITIES_CONTROLLER.deleteActuality);
ROUTER.post('/actualities/delete-image', ACTUALITIES_CONTROLLER.deleteImage);

// Routes pour les archives
ROUTER.get('/archives', ARCHIVES_CONTROLLER.getAllActualitiesArchives);

// Route pour afficher tous les medias
ROUTER.get('/medias', MEDIAS_CONTROLLER.getAllMedias);
ROUTER.get('/medias/create', MEDIAS_CONTROLLER.getNewMediaForm);
ROUTER.post('/medias/create', MEDIAS_CONTROLLER.uploadImage, MEDIAS_CONTROLLER.createMedia);
ROUTER.get('/medias/edit/:id', MEDIAS_CONTROLLER.getEditMediaForm);
ROUTER.post('/medias/edit/:id', MEDIAS_CONTROLLER.uploadImage, MEDIAS_CONTROLLER.updateMedia);
ROUTER.post('/medias/delete/:id', MEDIAS_CONTROLLER.deleteMedia);


// Route pour afficher le club
ROUTER.get('/club/show/:id', CLUB_CONTROLLER.getShowClub);
ROUTER.get('/club/edit/:id', CLUB_CONTROLLER.getEditClubForm);
ROUTER.post('/club/edit/:id', CLUB_CONTROLLER.uploadImages, CLUB_CONTROLLER.updateClub);

// Route pour afficher tous les documents d'inscription
ROUTER.get('/documents', DOCUMENTS_CONTROLLER.getAllDocuments);
ROUTER.get('/documents/create', DOCUMENTS_CONTROLLER.getNewDocumentsForm);
ROUTER.post('/documents/create', DOCUMENTS_CONTROLLER.uploadPDF, DOCUMENTS_CONTROLLER.createDocument);
ROUTER.get('/documents/edit/:id', DOCUMENTS_CONTROLLER.getEditDocumentForm);
ROUTER.post('/documents/edit/:id', DOCUMENTS_CONTROLLER.uploadPDF, DOCUMENTS_CONTROLLER.updateDocument);
ROUTER.post('/documents/delete/:id', DOCUMENTS_CONTROLLER.deleteDocument);

module.exports = ROUTER;
