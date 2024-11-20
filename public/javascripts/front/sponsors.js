$(document).ready(function () {
    $('.sponsors-slider').slick({
        vertical: false,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 0,
        speed: 4000,
        cssEase: 'linear',
        slidesToShow: 12,
        slidesToScroll: 1,
        arrows: false,
        pauseOnHover: false,
        responsive: [
            {
                breakpoint: 1440,
                settings: {
                    slidesToShow: 9,
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 6,
                }
            },
            {
                breakpoint: 801,
                settings: {
                    slidesToShow: 6,
                }
            },
            {
                breakpoint: 650,
                settings: {
                    slidesToShow: 5,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 4,
                }
            }
        ]
    });
});