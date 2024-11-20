// Configuration de TinyMCE avec les emojis et boutons personnalisés
tinymce.init({
    selector: '#description',
    height: '60vh',
    forced_root_block: '',
    enter_br: true,
    force_br_newlines: true,
    force_p_newlines: false,
    plugins: 'lists link textcolor emoticons underline',
    toolbar: 'undo redo | bold italic | bullist | forecolor link | underline | checkmark crossmark | emoticons',
    menubar: false,
    color_map: ['e70614', 'Red', '046baf', 'Blue', '374151', 'Black'],
    textcolor_rows: 1,
    setup: function (editor) {
        editor.ui.registry.addButton('checkmark', {
            text: '✔️',
            tooltip: 'Ajouter une Victoire',
            onAction: function () {
                editor.insertContent('✔️');
            }
        });
        editor.ui.registry.addButton('crossmark', {
            text: '❌',
            tooltip: 'Ajouter une Défaite',
            onAction: function () {
                editor.insertContent('❌');
            }
        });
    }
});

// Charger la date actuelle comme valeur par défaut si aucune date n'est définie
const dateInput = document.getElementById('date_actuality');
if (!dateInput.value) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
}

// Valider les champs de l'étape 1
function validateStep1() {
    let isValid = true;

    const title = document.getElementById('title').value.trim();
    if (title === "") {
        document.getElementById('titleError').classList.remove('hidden');
        isValid = false;
    } else {
        document.getElementById('titleError').classList.add('hidden');
    }

    return isValid;
}

// Valider les champs de l'étape 2
function validateStep2() {
    const descriptionContent = tinymce.get("description").getContent({ format: "text" }).trim();
    if (descriptionContent === "") {
        document.getElementById("descriptionError").classList.remove("hidden");
        return false;
    } else {
        document.getElementById("descriptionError").classList.add("hidden");
        return true;
    }
}

// Gestion des étapes
function showDescriptionStep() {
    if (!validateStep1()) return;
    document.getElementById('step1').classList.add('hidden');
    document.getElementById('step2').classList.remove('hidden');
}

function showPreviousStep() {
    // Permettre de revenir à l'étape précédente sans validation
    document.getElementById('step2').classList.add('hidden');
    document.getElementById('step1').classList.remove('hidden');
}

// Validation avant soumission du formulaire
document.getElementById("actualityForm").addEventListener("submit", function (event) {
    const descriptionContent = tinymce.get("description").getContent({ format: "text" }).trim();
    if (descriptionContent === "") {
        event.preventDefault();
        document.getElementById("descriptionError").classList.remove("hidden");
    } else {
        document.getElementById("descriptionError").classList.add("hidden");
    }
});

// Fonction de suppression d'image avec requête serveur
function removeImage(file) {
    const imagePathsField = document.getElementById("imagePaths");
    let currentImages = JSON.parse(imagePathsField.value || "[]");

    // Supprimer l'image du champ caché
    currentImages = currentImages.filter(path => path !== file.serverFilePath);
    imagePathsField.value = JSON.stringify(currentImages);

    // Envoyer une requête pour supprimer physiquement le fichier sur le serveur
    fetch('/admin/actualities/delete-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath: file.serverFilePath })
    })
        .then(response => response.json())
        .then(data => console.log(data.message))
        .catch(error => console.error('Erreur lors de la suppression du fichier:', error));

    // Supprimer l'élément de prévisualisation dans Dropzone
    if (file.previewElement) {
        file.previewElement.remove();
    }
}

// Configuration de Dropzone pour gérer l'ajout et la suppression d'images
Dropzone.autoDiscover = false;
const DROPZONE_COMPONENT = new Dropzone("#myAwesomeDropzone", {
    url: "/admin/actualities/upload",
    paramName: "images",
    maxFiles: 10,
    maxFilesize: 10,
    addRemoveLinks: true,
    init: function () {
        const existingImages = JSON.parse(document.getElementById("imagePaths").value || "[]");

        existingImages.forEach(imagePath => {
            const mockFile = { name: imagePath.split('/').pop(), serverFilePath: imagePath };
            this.emit("addedfile", mockFile);
            this.emit("thumbnail", mockFile, imagePath);
            this.emit("complete", mockFile);

            // Ajoutez un événement de suppression pour chaque image existante
            const removeButton = mockFile.previewElement.querySelector(".dz-remove");
            removeButton.addEventListener("click", () => removeImage(mockFile));
        });
    },
    success: function (file, response) {
        const imagePathsField = document.getElementById("imagePaths");
        let currentImages = JSON.parse(imagePathsField.value || "[]");

        // Stocker le chemin exact de chaque fichier uploadé dans file pour y accéder lors de la suppression
        file.serverFilePath = response.files[0]; // Assurez-vous que le chemin est correct
        currentImages.push(response.files[0]);
        imagePathsField.value = JSON.stringify(currentImages);
    },
    removedfile: function (file) {
        removeImage(file); // Appeler la fonction de suppression sur clic du bouton
    }
});