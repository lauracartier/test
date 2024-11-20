function notificationApp() {
    return {
        open: false,
        toastMessage: "",
        toastColor: "bg-green-500",
        toastIcon: "bx bx-check",

        init() {
            // Lire le paramètre "status" dans l'URL
            const urlParams = new URLSearchParams(window.location.search);
            const status = urlParams.get("status");

            // Définir le message, la couleur et l'icône en fonction du paramètre "status"
            if (status === "created") {
                this.showToast("Créé avec succès !", "bg-green-500", "bx bx-check");
            } else if (status === "edited") {
                this.showToast("Modifié avec succès !", "bg-yellow-500", "bx bx-edit");
            } else if (status === "deleted") {
                this.showToast("Supprimé avec succès !", "bg-line-red", "bx bx-trash");
            }
        },

        showToast(message, color, icon) {
            this.toastMessage = message;
            this.toastColor = color;
            this.toastIcon = icon;
            this.openToast();
        },

        openToast() {
            this.open = true;
            setTimeout(() => {
                this.open = false;
            }, 8000);
        },

        closeToast() {
            this.open = false;
        },
    };
}

document.addEventListener("alpine:init", () => {
    Alpine.data("notificationApp", notificationApp);
});