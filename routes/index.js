const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();

/* GET home page. */
ROUTER.get('/', function(req, res, next) {
  res.render('./front/layout', { title: 'Goélands' });
});

module.exports = ROUTER;
