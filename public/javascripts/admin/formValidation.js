function validateForm(event) {
    const form = event.target;
    let isValid = true;

    // Sélectionner tous les champs requis dans le formulaire
    const requiredFields = form.querySelectorAll("[required]");

    requiredFields.forEach(field => {
        const errorElement = document.getElementById(`${field.id}Error`);

        // Réinitialise l'affichage des erreurs
        if (errorElement) {
            errorElement.classList.add("hidden");
        }
        field.classList.remove("border-red-500");

        // Vérification de la validité du champ
        if (!field.value.trim()) {
            if (errorElement) {
                errorElement.classList.remove("hidden");
            }
            field.classList.add("border-red-500");
            isValid = false;
        } else if (field.type === "file" && field.files.length > 0 && !field.value.match(/\.(jpg|jpeg|png|gif)$/i)) {
            // Si c'est un champ fichier et qu'un fichier est sélectionné, vérifie l'extension
            if (errorElement) {
                errorElement.classList.remove("hidden");
                errorElement.textContent = "Veuillez ajouter une image valide.";
            }
            field.classList.add("border-red-500");
            isValid = false;
        } else if (field.type === "url" && !field.value.match(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i)) {
            // Vérification du format du lien si c'est un champ de type URL
            if (errorElement) {
                errorElement.classList.remove("hidden");
                errorElement.textContent = "Veuillez entrer un lien valide.";
            }
            field.classList.add("border-red-500");
            isValid = false;
        }
    });

    // Empêche la soumission si le formulaire est invalide
    if (!isValid) {
        event.preventDefault();
        form.classList.add("was-validated");
    }
}

// Associer la fonction de validation aux formulaires de création et d'édition
document.addEventListener("DOMContentLoaded", () => {
    const forms = document.querySelectorAll("form.validate-form");
    forms.forEach(form => form.addEventListener("submit", validateForm));
});
