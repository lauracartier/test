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

Dropzone.autoDiscover = false;
const DROPZONE_COMPONENT = new Dropzone("#myAwesomeDropzone", {
    url: "/admin/actualities/upload",
    paramName: "images",
    maxFiles: 10,
    maxFilesize: 10,
    addRemoveLinks: true,
    success: function (file, response) {
        const imagePathsField = document.getElementById("imagePaths");
        let currentImages = JSON.parse(imagePathsField.value || "[]");

        // Stocker le chemin exact de chaque fichier uploadé dans file pour y accéder lors de la suppression
        file.serverFilePath = response.files;

        currentImages = currentImages.concat(response.files);
        imagePathsField.value = JSON.stringify(currentImages);

        console.log("Image ajoutée:", currentImages);
    },

    removedfile: function (file) {
        const imagePathsField = document.getElementById("imagePaths");
        let currentImages = JSON.parse(imagePathsField.value || "[]");

        // Mettre à jour l'input caché pour retirer le fichier supprimé
        currentImages = currentImages.filter(path => path !== file.serverFilePath[0]);
        imagePathsField.value = JSON.stringify(currentImages);

        // Envoyer la requête pour supprimer physiquement le fichier du serveur
        fetch('/admin/actualities/delete-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ filePath: file.serverFilePath[0] })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);
            })
            .catch(error => {
                console.error('Erreur lors de la suppression du fichier:', error);
            });

        // Supprimer l'élément de prévisualisation dans Dropzone
        if (file.previewElement) {
            file.previewElement.remove();
        }
    }
});

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

const dateInput = document.getElementById('date_actuality');
const today = new Date().toISOString().split('T')[0];
dateInput.value = today;

document.getElementById("actualityForm").addEventListener("submit", function (event) {
    const descriptionContent = tinymce.get("description").getContent({ format: "text" }).trim();
    if (descriptionContent === "") {
        event.preventDefault(); // Empêche la soumission du formulaire
        document.getElementById("descriptionError").classList.remove("hidden");
    } else {
        document.getElementById("descriptionError").classList.add("hidden");
    }
});