$(document).ready(function () {
    const sliderContainer = $('.slider-container');

    sliderContainer.slick({
        infinite: false,
        slidesToShow: 3,
        slidesToScroll: 1,
        draggable: false,
        arrows: true,
        prevArrow: '<button type="button" class="slick-prev absolute top-1/2 left-0 transform -translate-y-1/2 text-line-blue focus:outline-none"><i class="fas fa-chevron-left text-2xl"></i></button>',
        nextArrow: '<button type="button" class="slick-next absolute top-1/2 right-0 transform -translate-y-1/2 text-line-blue focus:outline-none"><i class="fas fa-chevron-right text-2xl"></i></button>',
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });

    function updateArrowColors() {
        const slick = sliderContainer.slick('getSlick');

        if (slick.slideCount <= 3) {
            // Cache les flèches si le nombre de slides est de 3 ou moins
            $('.custom-prev-arrow, .custom-next-arrow').hide();
            return;
        } else {
            $('.custom-prev-arrow, .custom-next-arrow').show();
        }

        // Met à jour les couleurs des flèches
        if (slick.currentSlide === 0) {
            $('.custom-prev-arrow i').addClass('text-gray-400').removeClass('text-line-blue'); // Grise la flèche gauche
        } else {
            $('.custom-prev-arrow i').removeClass('text-gray-400').addClass('text-line-blue'); // Remet la flèche gauche normale
        }

        if (slick.currentSlide === slick.slideCount - slick.options.slidesToShow) {
            $('.custom-next-arrow i').addClass('text-gray-400').removeClass('text-line-blue'); // Grise la flèche droite
        } else {
            $('.custom-next-arrow i').removeClass('text-gray-400').addClass('text-line-blue'); // Remet la flèche droite normale
        }
    }

    updateArrowColors();

    $('.custom-prev-arrow').on('click', function () {
        sliderContainer.slick('slickPrev');
    });
    $('.custom-next-arrow').on('click', function () {
        sliderContainer.slick('slickNext');
    });

    sliderContainer.on('afterChange', function () {
        updateArrowColors();
    });
});

function adjustCardHeights() {
    const CARDS = document.querySelectorAll(".h-card > a");
    let maxHeight = 0;

    // Trouver la hauteur maximale des <a>
    CARDS.forEach(card => {
        maxHeight = Math.max(maxHeight, card.offsetHeight);
    });

    // Appliquer la hauteur maximale aux parents .h-card
    CARDS.forEach(card => {
        card.parentElement.style.height = `${maxHeight + 60}px`;
    });
}

// Appeler la fonction une fois que le DOM est chargé
document.addEventListener("DOMContentLoaded", () => {
    adjustCardHeights();

    // Réattacher l'ajustement des hauteurs au redimensionnement de la fenêtre
    window.addEventListener("resize", adjustCardHeights);
});

