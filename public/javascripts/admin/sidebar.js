// Script pour afficher/masquer la barre latérale et les logos

const SIDEBAR = document.getElementById('sidebar');
const SIDEBAR_LOGO = document.getElementById('sidebar-logo');
const HEADER_LOGO = document.getElementById('header-logo');
const MENU_TOGGLE = document.getElementById('menu-toggle');

MENU_TOGGLE.addEventListener('click', () => {
    SIDEBAR.classList.toggle('hidden');

    if (window.innerWidth < 768) {
        if (SIDEBAR.classList.contains('hidden')) {
            HEADER_LOGO.classList.add('hidden');
            SIDEBAR_LOGO.classList.remove('hidden');
        } else {
            HEADER_LOGO.classList.remove('hidden');
            SIDEBAR_LOGO.classList.add('hidden');
        }
    }
});