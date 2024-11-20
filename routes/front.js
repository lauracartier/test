const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();
const DOCUMENTS_CONTROLLER = require("../controllers/documents");
const HOME_CONTROLLER = require("../controllers/home");
const MEDIAS_CONTROLLER = require("../controllers/medias");
const PRESSE_CONTROLLER = require("../controllers/presse");
const ARCHIVES_CONTROLLER = require("../controllers/archives");

ROUTER.get('/', HOME_CONTROLLER.getInfos);

ROUTER.get('/historique', function (req, res, next) {
    res.render('./front/historique', { title: 'Historique - Goélands' });
});

ROUTER.get('/inscription', DOCUMENTS_CONTROLLER.getDocuments);

ROUTER.get('/joueurs', function (req, res, next) {
    res.render('./front/joueurs', { title: 'Joueurs - Goélands' });
});

ROUTER.get('/comite', function (req, res, next) {
    res.render('./front/comite', { title: 'Comité - Goélands' });
});

ROUTER.get('/presse', PRESSE_CONTROLLER.getPresse);
ROUTER.get('/presse/:id', PRESSE_CONTROLLER.getPresseById);

ROUTER.get('/archives', ARCHIVES_CONTROLLER.getPresseArchives);
ROUTER.get('/archives/:id', PRESSE_CONTROLLER.getPresseById);

ROUTER.get('/medias', MEDIAS_CONTROLLER.getAllMedias);

ROUTER.get('/championnat', function (req, res, next) {
    res.render('./front/championnat', { title: 'Championnat - Goélands' });
});

ROUTER.get('/contact', function (req, res, next) {
    res.render('./front/contact', { title: 'Contact - Goélands' });
});

module.exports = ROUTER;
