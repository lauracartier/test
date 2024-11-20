
const carousel = $('.carousel-images');
carousel.slick({
    infinite: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: '<button type="button" class="slick-prev absolute top-1/2 left-[-20px] transform -translate-y-1/2 text-line-blue focus:outline-none"><i class="fas fa-chevron-left text-2xl"></i></button>',
    nextArrow: '<button type="button" class="slick-next absolute top-1/2 right-[-20px] transform -translate-y-1/2 text-line-blue focus:outline-none"><i class="fas fa-chevron-right text-2xl"></i></button>',
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


// Hide arrows when at the start or end of the carousel
function updateArrowsState() {
    const currentSlide = carousel.slick('slickCurrentSlide');
    const totalSlides = carousel.slick('getSlick').slideCount;
    const slidesToShow = carousel.slick('getSlick').options.slidesToShow;

    // Check if on the first slide
    if (currentSlide === 0) {
        $('.slick-prev').hide();
    } else {
        $('.slick-prev').show();
    }

    // Check if on the last set of slides
    if (currentSlide >= totalSlides - slidesToShow) {
        $('.slick-next').hide();
    } else {
        $('.slick-next').show();
    }
}

// Initialize the state of the arrows
carousel.on('init', function () {
    updateArrowsState();
});

// Update arrow visibility after slide change
carousel.on('afterChange', function () {
    updateArrowsState();
});