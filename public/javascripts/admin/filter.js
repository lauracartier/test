const ITEMS_PER_PAGE = 5;
let currentPage = 1;
let filteredRows = Array.from(document.querySelectorAll("#TableBody tr"));
let sortOrder = 1;

// Fonction de tri
function sortTable(columnIndex) {
    const TABLE_BODY = document.getElementById("TableBody");

    sortOrder = -sortOrder;

    document.querySelectorAll("svg[id^='sortIcon']").forEach(icon => {
        icon.classList.remove("transform", "rotate-180");
    });

    const SORT_ICON = document.getElementById(`sortIcon${columnIndex}`);
    if (sortOrder === -1) {
        SORT_ICON.classList.add("transform", "rotate-180");
    }

    filteredRows.sort((a, b) => {
        let CELL_A = a.cells[columnIndex].textContent.trim();
        let CELL_B = b.cells[columnIndex].textContent.trim();

        // Vérifie si la colonne contient des dates au format jj/mm/aaaa
        const DATE_PATTERN = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        const MATCH_A = CELL_A.match(DATE_PATTERN);
        const MATCH_B = CELL_B.match(DATE_PATTERN);

        if (MATCH_A && MATCH_B) {
            // Convertit les dates en objets Date (année, mois - 1, jour)
            const DATE_A = new Date(MATCH_A[3], MATCH_A[2] - 1, MATCH_A[1]);
            const DATE_B = new Date(MATCH_B[3], MATCH_B[2] - 1, MATCH_B[1]);
            return (DATE_A - DATE_B) * sortOrder;
        } else {
            // Si ce ne sont pas des dates, on les compare comme des chaînes de caractères
            CELL_A = CELL_A.toLowerCase();
            CELL_B = CELL_B.toLowerCase();
            return CELL_A.localeCompare(CELL_B) * sortOrder;
        }
    });

    filteredRows.forEach(row => TABLE_BODY.appendChild(row));

    updateTable();
    displayPagination();
}




// Fonction pour afficher la pagination
function displayPagination() {
    const totalPages = Math.ceil(filteredRows.length / ITEMS_PER_PAGE);
    const paginationControls = document.getElementById("paginationControls");

    if (paginationControls) paginationControls.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.className = "px-3 py-1 border rounded-md " + (i === currentPage ? "bg-line-blue text-white" : "bg-white");
        button.onclick = () => changePage(i);
        paginationControls.appendChild(button);
    }
}

// Fonction pour changer de page
function changePage(page) {
    currentPage = page;
    updateTable();
    displayPagination();
}

// Fonction pour mettre à jour l'affichage des lignes
function updateTable() {
    filteredRows.forEach((row, index) => {
        row.style.display = (index >= (currentPage - 1) * ITEMS_PER_PAGE && index < currentPage * ITEMS_PER_PAGE) ? "" : "none";
    });
}

// Initialiser la pagination et l'affichage
function initializePagination() {
    currentPage = 1;
    filteredRows = Array.from(document.querySelectorAll("#TableBody tr"));
    updateTable();
    displayPagination();
}

function filterTable(columnsToSearch) {
    const SEARCH_INPUT = document.getElementById("searchInput").value.toLowerCase();
    const rows = Array.from(document.querySelectorAll("#TableBody tr"));

    filteredRows = rows.filter(row => {
        // Vérifie si au moins une des colonnes spécifiées contient le terme de recherche
        const isVisible = columnsToSearch.some(columnIndex => {
            const cellContent = row.cells[columnIndex]?.textContent.toLowerCase() || "";
            return cellContent.includes(SEARCH_INPUT);
        });

        row.style.display = isVisible ? "" : "none";
        return isVisible;
    });

    // Réinitialiser la page actuelle et mettre à jour la pagination
    currentPage = 1;
    updateTable();
    displayPagination();
}


document.addEventListener("DOMContentLoaded", initializePagination);


