const ACTUALITY_MODEL = require("../../models/actuality");
const SEASON_MODEL = require("../../models/season");
const PATH = require("path");
const MULTER = require("multer");
const FS = require("fs");
const SHARP = require("sharp");

let uploadedImages = []; // Variable pour stocker temporairement les chemins d'images

// Configuration de multer pour le stockage des fichiers
const STORAGE = MULTER.diskStorage({
    destination: function (req, file, cb) {
        cb(null, PATH.join(__dirname, "../../public/uploads/actualities"));
    },
    filename: function (req, file, cb) {
        const UNIQUE_SUFFIX = Date.now() + "-" + Math.round(Math.random() * 1e3);
        const ORIGINAL_NAME = PATH.parse(file.originalname).name.replace(/\s+/g, '_').toLowerCase();
        const EXTENSION = ".png";
        cb(null, ORIGINAL_NAME + "-" + UNIQUE_SUFFIX + EXTENSION);
    },
});

const UPLOAD = MULTER({ storage: STORAGE });

exports.uploadImages = (req, res) => {
    UPLOAD.array("images", 10)(req, res, (err) => {
        if (err instanceof MULTER.MulterError || err) {
            console.error("Erreur de téléchargement:", err);
            return res.status(500).json({ error: "Erreur lors du téléchargement des images." });
        }

        const uploadedImages = req.files.map(file => {
            const FILE_PATH = PATH.join(file.destination, file.filename);
            const TEMP_FILE_PATH = FILE_PATH + "-temp.png"; // Utilisation de PNG pour la transparence

            SHARP(file.path)
                .metadata() // Récupérer les dimensions originales de l'image
                .then(metadata => {
                    if (metadata.width > 1200 || metadata.height > 800) {
                        // Redimensionner uniquement si l'image dépasse 1200x800
                        return SHARP(file.path)
                            .resize({
                                width: 1200,
                                height: 800,
                                fit: SHARP.fit.inside, // Adapter les dimensions sans déformation
                                withoutEnlargement: true, // Ne pas agrandir les petites images
                            })
                            .png({ quality: 90 }) // Compresser en PNG pour conserver la transparence
                            .toFile(TEMP_FILE_PATH)
                            .then(() => {
                                // Remplacer le fichier original par l'image redimensionnée
                                FS.renameSync(TEMP_FILE_PATH, FILE_PATH);
                            });
                    } else {
                        // Ajouter une bordure transparente pour centrer l'image si elle est petite
                        return SHARP(file.path)
                            .extend({
                                top: Math.max((800 - metadata.height) / 2, 0),
                                bottom: Math.max((800 - metadata.height) / 2, 0),
                                left: Math.max((1200 - metadata.width) / 2, 0),
                                right: Math.max((1200 - metadata.width) / 2, 0),
                                background: { r: 0, g: 0, b: 0, alpha: 0 }, // Fond transparent
                            })
                            .png({ quality: 90 }) // Compresser en PNG
                            .toFile(TEMP_FILE_PATH)
                            .then(() => {
                                // Remplacer l'image originale
                                FS.renameSync(TEMP_FILE_PATH, FILE_PATH);
                            });
                    }
                })
                .catch(err => console.error("Erreur lors du traitement de l'image:", err));

            return `/uploads/actualities/${file.filename}`;
        });

        // Envoyer les chemins d'image au front-end
        res.status(200).json({ message: "Images téléchargées avec succès", files: uploadedImages });
    });
};


exports.deleteImage = (req, res) => {
    const { filePath } = req.body;

    if (!filePath) {
        return res.status(400).json({ message: 'Chemin de fichier non fourni' });
    }

    const FULL_PATH = PATH.join(__dirname, '..', '..', 'public', filePath); // Ajustez le chemin de base si nécessaire

    FS.unlink(FULL_PATH, (err) => {
        if (err) {
            console.error('Erreur de suppression de fichier:', err);
            return res.status(500).json({ message: 'Erreur lors de la suppression du fichier' });
        }
        res.status(200).json({ message: 'Fichier supprimé avec succès' });
    });
};

// Route de création d'actualité avec multer pour gérer le corps de la requête
exports.createActuality = async (req, res) => {
    try {
        const activeSeason = await SEASON_MODEL.findOne({ where: { active: true } });

        if (!activeSeason) return res.status(400).send("Aucune saison active n'a été trouvée.");

        const { title, subtitle, description, imagePaths } = req.body;
        let { date_actuality } = req.body;
        const parsedImagePaths = imagePaths ? JSON.parse(imagePaths) : [];

        if (date_actuality == '') date_actuality = null;

        if (!title || !description) return res.status(400).json({ error: "Le titre et la description sont requis." });

        await ACTUALITY_MODEL.create({
            title,
            subtitle,
            date_actuality,
            description,
            season_id: activeSeason.id,
            image: JSON.stringify(parsedImagePaths),
        });

        res.redirect("/admin/actualities?status=created");
    } catch (error) {
        res.status(500).send("Erreur lors de la création de l'actualité.");
    }
};

// Afficher toutes les actualités
exports.getAllActualities = async (req, res) => {
    try {
        // Récupérer la saison active
        const ACTIVE_SEASON = await SEASON_MODEL.findOne({ where: { active: true } });

        if (!ACTIVE_SEASON) {
            return res.status(400).send("Aucune saison active n'a été trouvée.");
        }

        // Récupérer toutes les actualités de la saison active
        const ACTUALITIES = await ACTUALITY_MODEL.findAll({
            where: { season_id: ACTIVE_SEASON.id },
            order: [['id', 'DESC']],
            include: [{ model: SEASON_MODEL, as: 'season', attributes: ['date_debut', 'date_fin'] }]
        });

        // Format de la saison active
        const SAISON = `Saison ${ACTIVE_SEASON.date_debut.getFullYear()} - ${ACTIVE_SEASON.date_fin.getFullYear()}`;

        // Rendre la vue avec les actualités de la saison active
        res.render("admin/actualities/index", {
            title: "Actualités",
            actualities: ACTUALITIES,
            saison: SAISON
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des actualités:", error);
        res.status(500).send("Erreur lors de la récupération des actualités.");
    }
};

// Afficher le formulaire pour ajouter une nouvelle actualité
exports.getNewActualityForm = async (req, res) => {
    try {
        // Récupérer la saison active dans la base de données
        const ACTIVE_SEASON = await SEASON_MODEL.findOne({ where: { active: true } });

        if (!ACTIVE_SEASON) {
            return res.status(404).json({ message: "Saison active introuvable" });
        }

        // Formatage de la saison active
        const SAISON = `Saison ${ACTIVE_SEASON.date_debut.getFullYear()} - ${ACTIVE_SEASON.date_fin.getFullYear()}`;

        // Passer la saison à la vue
        res.render("admin/actualities/create", {
            title: "Actualités",
            saison: SAISON
        });
    } catch (error) {
        console.error("Erreur lors de la récupération de la saison active:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Afficher le formulaire pour modifier une actualité existante
exports.getEditActualityForm = async (req, res) => {
    try {
        const { id } = req.params;
        const actuality = await ACTUALITY_MODEL.findByPk(id,{
        include: [{ model: SEASON_MODEL, as: 'season', attributes: ['date_debut', 'date_fin'] }]});

        if (!actuality) return res.status(404).send("Actualité non trouvée.");

        // Récupérer les images existantes de l'actualité
        const existingImages = actuality.image ? JSON.parse(actuality.image) : [];

        res.render("admin/actualities/edit", {
            title: "Modifier une actualité",
            actuality: actuality,
            existingImages: existingImages
        });
    } catch (error) {
        console.error("Erreur lors de la récupération de l'actualité:", error);
        res.status(500).send("Erreur lors de la récupération de l'actualité.");
    }
};


// Mettre à jour une actualité existante avec des images multiples
exports.updateActuality = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, subtitle, description, imagePaths } = req.body;
        let { date_actuality } = req.body;
        const parsedImagePaths = imagePaths ? JSON.parse(imagePaths) : [];

        const ACTUALITY = await ACTUALITY_MODEL.findByPk(id, {
            include: [
                {
                    model: SEASON_MODEL,
                    as: 'season',
                    attributes: ['active'],
                },
            ],
        });

        if (!ACTUALITY) return res.status(404).send("Actualité non trouvée.");

        if (date_actuality === '') date_actuality = null;

        const status = ACTUALITY.season ? ACTUALITY.season.active : null;

        let imagesToSave = parsedImagePaths;
        
        await ACTUALITY.update({
            title,
            subtitle,
            date_actuality,
            description,
            image: JSON.stringify(imagesToSave)
        });

        if (status === true) {
            res.redirect("/admin/actualities?status=edited");
        } else {
            res.redirect("/admin/archives?status=edited");
        }

    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'actualité:", error);
        res.status(500).send("Erreur lors de la mise à jour de l'actualité.");
    }
};

// Supprimer une actualité et ses images associées
exports.deleteActuality = async (req, res) => {
    try {
        const { id } = req.params;
        const ACTUALITY = await ACTUALITY_MODEL.findByPk(id, {
            include: [
                {
                    model: SEASON_MODEL,
                    as: 'season',
                    attributes: ['active'],
                },
            ],
        });

        if (!ACTUALITY) return res.status(404).send("Actualité non trouvée.");

        const status = ACTUALITY.season ? ACTUALITY.season.active : null;

        const IMAGES_PATHS = JSON.parse(ACTUALITY.image) || [];
        IMAGES_PATHS.forEach(imagePath => {
            const filePath = PATH.join(__dirname, "../../public", imagePath);
            if (FS.existsSync(filePath)) FS.unlinkSync(filePath);
        });

        await ACTUALITY.destroy();

        if (status === true) {
            res.redirect("/admin/actualities?status=deleted");
        } else {
            res.redirect("/admin/archives?status=deleted");
        }

    } catch (error) {
        res.status(500).send("Erreur lors de la suppression de l'actualité.");
    }
};
