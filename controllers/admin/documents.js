const DOCUMENTS_MODEL = require("../../models/documents");
const MULTER = require("multer");
const PATH = require("path");
const FS = require("fs");

// Configuration de multer pour le stockage des fichiers PDF
const STORAGE = MULTER.diskStorage({
  destination: function (req, file, cb) {
    cb(null, PATH.join(__dirname, "../../public/uploads/documents"));
  },
  filename: function (req, file, cb) {
    const UNIQUE_SUFFIX = Date.now() + "-" + Math.round(Math.random() * 1e3);
    const ORIGINAL_NAME = PATH.parse(file.originalname).name.replace(/\s+/g, '_').toLowerCase();
    cb(null, ORIGINAL_NAME + "-" + UNIQUE_SUFFIX + ".pdf");
  }
});

// Filtrer uniquement les fichiers PDF
const FILE_FILTER = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Seuls les fichiers PDF sont autorisés"), false);
  }
};

const UPLOAD = MULTER({ storage: STORAGE, fileFilter: FILE_FILTER });

// Middleware pour le téléchargement de fichiers PDF
exports.uploadPDF = UPLOAD.single("file");

exports.getAllDocuments = async (req, res) => {
    try {
        const DOCUMENTS = await DOCUMENTS_MODEL.findAll({
            order: [['id', 'DESC']]
        });
        res.render("admin/documents/index", { title: "Documents d'inscription", documents: DOCUMENTS });
    } catch (error) {
        res.status(500).send("Erreur lors de la récupération des documents d'inscription.");
    }
};

exports.getNewDocumentsForm = (req, res) => {
    res.render("admin/documents/create", { title: "Document d'inscription" });
};

exports.createDocument = async (req, res) => {
    try {
        const { name, description } = req.body;
        let filePath = null;
        if (req.file) filePath = "/uploads/documents/" + req.file.filename; // Chemin d'accès au fichier PDF

        await DOCUMENTS_MODEL.create({ name, file: filePath, description: description });
        res.redirect("/admin/documents?status=created");
    } catch (error) {
        res.status(500).send("Erreur lors de la création du document d'inscription.");
    }
};

exports.getEditDocumentForm = async (req, res) => {
    try {
        const { id } = req.params;
        const DOCUMENT = await DOCUMENTS_MODEL.findByPk(id);
        if (!DOCUMENT) return res.status(404).send("Document non trouvé.");

        res.render("admin/documents/edit", { title: "Document d'inscription", document: DOCUMENT });
    } catch (error) {
        res.status(500).send("Erreur lors de la récupération du document d'inscription.");
    }
};

exports.updateDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const DELETE_FILE = req.body.deleteFile === 'true';
        const DOCUMENT = await DOCUMENTS_MODEL.findByPk(id);
        if (!DOCUMENT) return res.status(404).send("Document non trouvé.");

        let filePath = DOCUMENT.file;
        // Si un fichier est uploadé ou si l'utilisateur demande de supprimer le fichier
        if (DELETE_FILE && DOCUMENT.file) {
            const OLD_FILE_PATH = PATH.join(__dirname, "../../public", DOCUMENT.file);
            if (FS.existsSync(OLD_FILE_PATH)) FS.unlinkSync(OLD_FILE_PATH);
            filePath = null;  // Supprime la référence au fichier
        }

        if (req.file) filePath = "/uploads/documents/" + req.file.filename;

        await DOCUMENT.update({ name, file: filePath, description: description });
        res.redirect("/admin/documents?status=edited");
    } catch (error) {
        res.status(500).send("Erreur lors de la mise à jour du document d'inscription.");
    }
};


exports.deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const DOCUMENT = await DOCUMENTS_MODEL.findByPk(id);
        if (!DOCUMENT) return res.status(404).send("Document non trouvé.");

        // Supprime le fichier PDF du serveur
        if (DOCUMENT.file) {
            const FILE_PATH = PATH.join(__dirname, "../../public", DOCUMENT.file);
            if (FILE_PATH && FS.existsSync(FILE_PATH)) FS.unlinkSync(FILE_PATH);
        }
        await DOCUMENT.destroy();
        res.redirect("/admin/documents?status=deleted");
    } catch (error) {
        res.status(500).send("Erreur lors de la suppression du document d'inscription.");
    }
};
