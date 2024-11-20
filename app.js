const EXPRESS = require('express');
const PATH = require('path');
const COOKIE_PARSER = require('cookie-parser');
const LOGGER = require('morgan');
const FRONT_ROUTES = require("./routes/front");
const ADMIN_ROUTES = require("./routes/admin");
const { sequelize } = require('./models');
const FOOTER_MIDDLEWARES = require('./middlewares/footerMiddlewares');
const EXPRESSLAYOUTS = require("express-ejs-layouts");
const cron = require('node-cron');
const updateSeasons = require('./updateSeasons'); // Assurez-vous d'avoir le fichier updateSeasons.js pour gérer la logique

const APP = EXPRESS();

// Utiliser express-ejs-layouts
APP.use(EXPRESSLAYOUTS);
APP.set("layout", "front/layout");

APP.use(LOGGER('dev'));
APP.use(EXPRESS.json());
APP.use(EXPRESS.urlencoded({ extended: true }));
APP.use(COOKIE_PARSER());
APP.use(EXPRESS.static(PATH.join(__dirname, 'public')));

APP.use(FOOTER_MIDDLEWARES);
APP.use('/', FRONT_ROUTES);
APP.use('/admin', ADMIN_ROUTES);

// Définir le moteur de vue comme EJS
APP.set("view engine", "ejs");
APP.set("views", "./views");

// Configuration de la tâche cron pour s'exécuter toutes les 5 minutes
cron.schedule('0 0 1 9 *', () => {
  console.log('Exécution de la tâche cron pour la mise à jour des saisons le 1er septembre');
  updateSeasons();
});


const PORT = process.env.PORT || 3000;
APP.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = APP;
