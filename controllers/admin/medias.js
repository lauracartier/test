const MEDIAS_MODEL = require("../../models/medias");
const PATH = require("path");
const MULTER = require("multer");
const FS = require("fs");
const SHARP = require("sharp");

// Configuration de multer pour le stockage des fichiers
const STORAGE = MULTER.diskStorage({
    destination: function (req, file, cb) {
        cb(null, PATH.join(__dirname, "../../public/uploads/medias"));
    },
    filename: function (req, file, cb) {
        const UNIQUE_SUFFIX = Date.now() + "-" + Math.round(Math.random() * 1e3);
        const ORIGINAL_NAME = PATH.parse(file.originalname).name.replace(/\s+/g, '_').toLowerCase();
        const EXTENSION = ".png";
        cb(null, ORIGINAL_NAME + "-" + UNIQUE_SUFFIX + EXTENSION);
    },
});

const UPLOAD = MULTER({ storage: STORAGE });

exports.uploadImage = (req, res, next) => {
    UPLOAD.single("image")(req, res, (err) => {
        if (err) {
            return res.status(500).send("Erreur lors du téléchargement de l'image.");
        }

        if (!req.file) {
            return next(); // Si pas de fichier, passe au prochain middleware
        }

        const FILE_PATH = PATH.join(req.file.destination, req.file.filename);
        const TEMP_FILE_PATH = FILE_PATH + "-temp.png"; // Fichier temporaire pour le traitement

        // Redimensionnement avec bordures transparentes
        SHARP(req.file.path)
            .resize(1024, 735, {
                fit: SHARP.fit.contain,
                background: { r: 0, g: 0, b: 0, alpha: 0 }, // Fond transparent
            })
            .png({ quality: 90 })
            .toFile(TEMP_FILE_PATH, (err) => {
                if (err) {
                    return res.status(500).send("Erreur lors de la compression de l'image.");
                }

                // Remplacer l'image d'origine par l'image compressée
                FS.rename(TEMP_FILE_PATH, FILE_PATH, (err) => {
                    if (err) {
                        return res.status(500).send("Erreur lors du remplacement de l'image.");
                    }
                    next();
                });
            });
        });
};

// Afficher tous les medias
exports.getAllMedias = async (req, res) => {
    try {
        const MEDIAS = await MEDIAS_MODEL.findAll({
            order: [['id', 'DESC']]
        });
        res.render("admin/medias/index", { title: "Médias", medias: MEDIAS });
    } catch (error) {
        res.status(500).send("Erreur lors de la récupération des médias.");
    }
};

// Afficher le formulaire pour ajouter un nouveau media
exports.getNewMediaForm = (req, res) => {
    res.render("admin/medias/create", { title: "Médias" });
};

// Créer un Media
exports.createMedia = async (req, res) => {
    try {
        const { name, video, date_media } = req.body;
        const IMAGE_PATH = req.file ? `/uploads/medias/${req.file.filename}` : null;

        // Si date_media est vide, on l'assigne à null
        const DATE_MEDIA_VALUE = date_media ? new Date(date_media) : null;

        await MEDIAS_MODEL.create({
            name,
            image: IMAGE_PATH,
            video,
            date_media: DATE_MEDIA_VALUE
        });
        res.redirect("/admin/medias?status=created");
    } catch (error) {
        res.status(500).send("Erreur lors de la création du média.");
    }
};


// Afficher le formulaire pour modifier un media existant
exports.getEditMediaForm = async (req, res) => {
    try {
        const { id } = req.params;
        const MEDIA = await MEDIAS_MODEL.findByPk(id);
        if (!MEDIA) return res.status(404).send("Média non trouvé.");

        res.render("admin/medias/edit", { title: "Médias", media: MEDIA });
    } catch (error) {
        res.status(500).send("Erreur lors de la récupération du média.");
    }
};

// Mettre à jour un media
exports.updateMedia = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, video, date_media } = req.body;
        const MEDIA = await MEDIAS_MODEL.findByPk(id);

        if (!MEDIA) return res.status(404).send("Média non trouvé.");

        let imagePath = MEDIA.image;
        if (req.file) {
            const oldImagePath = PATH.join(__dirname, "../../public", MEDIA.image);
            if (FS.existsSync(oldImagePath)) FS.unlinkSync(oldImagePath);

            imagePath = `/uploads/medias/${req.file.filename}`;
        }

        await MEDIA.update({ name, image: imagePath, video, date_media });
        res.redirect("/admin/medias?status=edited");
    } catch (error) {
        res.status(500).send("Erreur lors de la mise à jour du media.");
    }
};

// Supprimer un media
exports.deleteMedia = async (req, res) => {
    try {
        const { id } = req.params;
        const MEDIA = await MEDIAS_MODEL.findByPk(id);

        if (!MEDIA) return res.status(404).send("Média non trouvé.");

        // Supprime l'image associée si elle existe
        if (MEDIA.image) {
            const IMAGE_PATH = PATH.join(__dirname, "../../public", MEDIA.image);
            if (FS.existsSync(IMAGE_PATH)) {
                FS.unlinkSync(IMAGE_PATH);
            }
        }

        await MEDIA.destroy({ where: { id } });
        res.redirect("/admin/medias?status=deleted");
    } catch (error) {
        console.error("Erreur lors de la suppression du média:", error);
        res.status(500).send("Erreur lors de la suppression du média.");
    }
};

