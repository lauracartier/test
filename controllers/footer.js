const CLUB = require('../models/club');
const SOCIAL_NETWORK = require('../models/socialNetworks');

async function getClub() {
    return await CLUB.findOne({
        where: { id: 1 },
        include: [
            {
                model: SOCIAL_NETWORK,
                as: "socialNetworks",
            },
        ],
    });
}

module.exports = { getClub: getClub };
