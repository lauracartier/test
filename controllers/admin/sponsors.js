const SPONSOR_MODEL = require("../../models/sponsors");
const PATH = require("path");
const MULTER = require("multer");
const FS = require("fs");
const SHARP = require("sharp");

// Configuration de multer pour le stockage des fichiers
const STORAGE = MULTER.diskStorage({
    destination: function (req, file, cb) {
        cb(null, PATH.join(__dirname, "../../public/uploads/sponsors"));
    },
    filename: function (req, file, cb) {
        const UNIQUE_SUFFIX = Date.now() + "-" + Math.round(Math.random() * 1e3);
        const ORIGINAL_NAME = PATH.parse(file.originalname).name.replace(/\s+/g, '_').toLowerCase(); // Nom sans espaces en minuscule
        const EXTENSION = ".png"; // Enregistrer les images en PNG pour transparence
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
            .resize(100, 100, {
                fit: SHARP.fit.contain,
                background: { r: 0, g: 0, b: 0, alpha: 0 }, // Fond transparent
            })
            .png({ quality: 80 })
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

// Afficher tous les sponsors
exports.getAllSponsors = async (req, res) => {
    try {
        const SPONSORS = await SPONSOR_MODEL.findAll({
            order: [['id', 'DESC']]
        });

        res.render("admin/sponsors/index", { title: "Partenaires", sponsors: SPONSORS });
    } catch (error) {
        res.status(500).send("Erreur lors de la récupération des partenaires.");
    }
};

// Afficher le formulaire pour ajouter un nouveau sponsor
exports.getNewSponsorForm = (req, res) => {
    res.render("admin/sponsors/create", { title: "Partenaires" });
};

// Créer un sponsor
exports.createSponsor = async (req, res) => {
    try {
        const { name, link } = req.body;

        const IMAGE_PATH = req.file ? `/uploads/sponsors/${req.file.filename}` : null;

        await SPONSOR_MODEL.create({ name, link, image: IMAGE_PATH });
        res.redirect("/admin/sponsors?status=created");
    } catch (error) {
        res.status(500).send("Erreur lors de la création du partenaire.");
    }
};

// Afficher le formulaire pour modifier un sponsor existant
exports.getEditSponsorForm = async (req, res) => {
    try {
        const { id } = req.params;
        const SPONSOR = await SPONSOR_MODEL.findByPk(id);
        if (!SPONSOR) return res.status(404).send("Partenaire non trouvé.");

        res.render("admin/sponsors/edit", { title: "Partenaires", sponsor: SPONSOR });
    } catch (error) {
        res.status(500).send("Erreur lors de la récupération du partenaire.");
    }
};

// Mettre à jour un sponsor
exports.updateSponsor = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, link } = req.body;
        const SPONSOR = await SPONSOR_MODEL.findByPk(id);

        if (!SPONSOR) return res.status(404).send("Partenaire non trouvé.");

        let imagePath = SPONSOR.image;
        if (req.file) {
            // Supprimer l'ancienne image si elle existe
            const oldImagePath = PATH.join(__dirname, "../../public", SPONSOR.image);
            if (FS.existsSync(oldImagePath)) FS.unlinkSync(oldImagePath);

            // Utiliser la nouvelle image
            imagePath = `/uploads/sponsors/${req.file.filename}`;
        }

        await SPONSOR.update({ name, link, image: imagePath });
        res.redirect("/admin/sponsors?status=edited");
    } catch (error) {
        res.status(500).send("Erreur lors de la mise à jour du partenaire.");
    }
};

// Supprimer un sponsor
exports.deleteSponsor = async (req, res) => {
    try {
        const { id } = req.params;
        const SPONSOR = await SPONSOR_MODEL.findByPk(id);

        if (!SPONSOR) return res.status(404).send("Partenaire non trouvé.");

        // Supprimer l'image associée
        const IMAGE_PATH = PATH.join(__dirname, "../../public", SPONSOR.image);
        if (FS.existsSync(IMAGE_PATH)) FS.unlinkSync(IMAGE_PATH);

        await SPONSOR.destroy({ where: { id } });
        res.redirect("/admin/sponsors?status=deleted");
    } catch (error) {
        res.status(500).send("Erreur lors de la suppression du partenaire.");
    }
};
