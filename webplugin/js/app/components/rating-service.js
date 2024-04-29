class RatingService {
    constructor() {
        this.appOptions = {};
        this.isCsatRatingBase = 0;
    }
    init(appOptions = {}) {
        const { widgetSettings = {} } = appOptions;
        this.appOptions = appOptions;
        this.isCsatRatingBase = widgetSettings.csatRatingBase
            ? widgetSettings.csatRatingBase
            : 3;
        if (this.isCsatRatingBase == 5) {
            this.starCsatHtmlEnable();
        }
    }
    starCsatHtmlEnable = () => {
        $applozic('.mck-smilies-inner').removeClass('vis').addClass('n-vis');

        $applozic('.mck-ratings-smilies').addClass('star-rating-extra');

        $applozic('.star-rating').removeClass('n-vis').addClass('vis');
    };

    generateStarSvgs = function (rating) {
        const ratingSVGs = Array.from(
            { length: rating },
            () => KommunicateConstants.STAR_SVG
        );
        return ratingSVGs.join('');
    };

    resetStarsColor = () => {
        const stars = document.querySelectorAll('.star-rating label');
        stars.forEach(function (star, index) {
            star.querySelector('svg path').style.fill = '';
        });
    };

    setStarsEffect = (rating) => {
        const stars = document.querySelectorAll('.star-rating label');
        let selectedRating = rating;

        function highlightStars(index) {
            for (let i = 0; i < stars.length; i++) {
                stars[i].querySelector('svg path').style.fill =
                    i <= index ? '#FFC045' : '#B3B3B3';
            }
        }
        function removeHighlightFromStars() {
            for (let i = 0; i < stars.length; i++) {
                stars[i].querySelector('svg path').style.fill = '#B3B3B3';
            }
        }
        highlightStars(selectedRating - 1);
        stars.forEach(function (star, index) {
            star.addEventListener('mouseover', function () {
                highlightStars(index);
            });
            star.addEventListener('mouseout', function () {
                const isAnyRatingSelected = document.querySelector(
                    '.mck-rating-box.selected'
                );
                if (isAnyRatingSelected == null) {
                    removeHighlightFromStars();
                } else {
                    highlightStars(selectedRating - 1);
                }
            });

            star.addEventListener('click', function () {
                selectedRating = index + 1;
                highlightStars(selectedRating - 1);
            });
        });
    };
}

const ratingService = new RatingService();
