const CLUB_MODEL = require("../../models/club");
const PATH = require("path");
const MULTER = require("multer");
const FS = require("fs");
const SHARP = require("sharp");

// Configuration de multer pour le stockage des fichiers
const STORAGE = MULTER.diskStorage({
    destination: function (req, file, cb) {
        cb(null, PATH.join(__dirname, "../../public/uploads/club"));
    },
    filename: function (req, file, cb) {
        const UNIQUE_SUFFIX = Date.now() + "-" + Math.round(Math.random() * 1e3);
        const ORIGINAL_NAME = PATH.parse(file.originalname).name.replace(/\s+/g, '_').toLowerCase(); // Nom sans espaces en minuscule
        const EXTENSION = ".png"; // Enregistrer les images en PNG pour transparence
        cb(null, ORIGINAL_NAME + "-" + UNIQUE_SUFFIX + EXTENSION);
    },
});

const UPLOAD = MULTER({ storage: STORAGE });

exports.uploadImages = (req, res, next) => {
    UPLOAD.fields([
        { name: "imageComiteNew", maxCount: 1 },
        { name: "roomImageNew", maxCount: 1 }
    ])(req, res, (err) => {
        if (err) {
            return res.status(500).send("Erreur lors du téléchargement des images.");
        }

        const processImage = (file, callback) => {
            // Définissez le chemin du fichier en combinant le répertoire et le nom du fichier
            const FILE_PATH = PATH.join(file.destination, file.filename);
            const TEMP_FILE_PATH = FILE_PATH + "-temp.png";
        
            // Vérifiez si le fichier source existe avant de continuer
            if (!FS.existsSync(FILE_PATH)) {
                return callback(new Error("Le fichier source est introuvable pour la compression."));
            }
        
            SHARP(FILE_PATH)
                .png({ quality: 80 })
                .toFile(TEMP_FILE_PATH, (err) => {
                    if (err) return callback(err);
        
                    // Remplace l'image d'origine par l'image compressée
                    FS.rename(TEMP_FILE_PATH, FILE_PATH, callback);
                });
        };

        const filesToProcess = [];
        if (req.files.imageComiteNew) filesToProcess.push(req.files.imageComiteNew[0]);
        if (req.files.roomImageNew) filesToProcess.push(req.files.roomImageNew[0]);

        let processedFiles = 0;
        filesToProcess.forEach((file) => {
            processImage(file, (err) => {
                if (err) {
                    return res.status(500).send("Erreur lors de la compression de l'image.");
                }
                processedFiles += 1;
                if (processedFiles === filesToProcess.length) {
                    next();
                }
            });
        });

        if (filesToProcess.length === 0) next(); // Passe au prochain middleware si pas d'image
    });
};


// Afficher le formulaire pour afficher le club
exports.getShowClub = async (req, res) => {
    try {
        const CLUB = await CLUB_MODEL.findByPk(1);
        if (!CLUB) return res.status(404).send("Club non trouvé.");

        res.render("admin/club/show", { title: "Club", club: CLUB });
    } catch (error) {
        res.status(500).send("Erreur lors de la récupération du club.");
    }
};

// Afficher le formulaire pour modifier un club existant
exports.getEditClubForm = async (req, res) => {
    try {
        const CLUB = await CLUB_MODEL.findByPk(1);
        if (!CLUB) return res.status(404).send("Club non trouvé.");

        res.render("admin/club/edit", { title: "Club", club: CLUB });
    } catch (error) {
        res.status(500).send("Erreur lors de la récupération du club.");
    }
};

// Mettre à jour un club
exports.updateClub = async (req, res) => {
    try {
        const { adress, addressDetails, cp, city, phone, mail } = req.body;
        const CLUB = await CLUB_MODEL.findByPk(1);
        if (!CLUB) return res.status(404).send("Club non trouvé.");

        let imagePathComite = CLUB.committee_image;
        let imagePathRoom = CLUB.room_image;

        if (req.files) {
            // Vérifier et mettre à jour l'image du comité directeur
            if (req.files.imageComiteNew && req.files.imageComiteNew[0]) {
                const OLD_IMG_PATH_COMITE = CLUB.committee_image ? PATH.join(__dirname, "../../public", CLUB.committee_image) : null;
                if (OLD_IMG_PATH_COMITE && FS.existsSync(OLD_IMG_PATH_COMITE)) FS.unlinkSync(OLD_IMG_PATH_COMITE);
                imagePathComite = `/uploads/club/${req.files.imageComiteNew[0].filename}`;
            }
        
            // Vérifier et mettre à jour l'image de la salle
            if (req.files.roomImageNew && req.files.roomImageNew[0]) {
                const OLD_IMG_PATH_ROOM = CLUB.room_image ? PATH.join(__dirname, "../../public", CLUB.room_image) : null;
                if (OLD_IMG_PATH_ROOM && FS.existsSync(OLD_IMG_PATH_ROOM)) FS.unlinkSync(OLD_IMG_PATH_ROOM);
                imagePathRoom = `/uploads/club/${req.files.roomImageNew[0].filename}`;
            }
        }

        await CLUB.update({ adress, addressDetails, cp, city, phone, mail, committee_image: imagePathComite, room_image: imagePathRoom });
        res.redirect("/admin/club/show/1?status=edited");
    } catch (error) {
        res.status(500).send("Erreur lors de la mise à jour du club.");
    }
};