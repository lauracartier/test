const SEASON = require('./models/season');

async function updateSeasons() {
    const today = new Date();
    console.log(today);
    console.log(today.getDate(), today.getMonth());
    const isFirstSeptember = today.getDate() === 13 && today.getMonth() === 10; // Vérifie si c'est le 1er septembre

    if (isFirstSeptember) {
        try {
            // Désactiver toutes les saisons actuelles
            await SEASON.update(
                { active: false },
                { where: { active: true } }
            );

            // Obtenir l'année en cours
            const currentYear = today.getFullYear();

            // Créer une nouvelle saison avec la date de début et de fin
            const newSeason = await SEASON.create({
                date_debut: new Date(Date.UTC(currentYear, 8, 1, 0, 0, 0)), // 1er septembre de l'année en cours à minuit UTC
                date_fin: new Date(Date.UTC(currentYear + 1, 7, 31, 23, 59, 59)), // 31 août de l'année suivante à 23h59 UTC
                active: true
            });

            console.log("Nouvelle saison créée:", newSeason);
        } catch (error) {
            console.error("Erreur lors de la mise à jour des saisons:", error);
        }
    } else {
        console.log("Aujourd'hui n'est pas le 1er septembre, pas de mise à jour des saisons.");
    }
}

module.exports = updateSeasons;
