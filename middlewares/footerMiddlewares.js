const { getClub } = require('../controllers/footer');
const SPONSORS_MODEL = require('../models/sponsors');

async function footerMiddlewares(req, res, next) {
    try {
        const GOELAND_CLUB = await getClub();
        res.locals.goelandClub = GOELAND_CLUB;
        
        const SPONSORS = await SPONSORS_MODEL.findAll();
        res.locals.sponsors = SPONSORS;
        next();
    } catch (error) {
        console.error('Error fetching Goeland Club:', error);
        next(error);
    }
}

module.exports = footerMiddlewares;