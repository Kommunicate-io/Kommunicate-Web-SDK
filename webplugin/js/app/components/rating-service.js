class RatingService {
    constructor() {
        this.appOptions = {};
        this.isCsatRatingBase = 0;
    }
    init(appOptions = {}) {
        const { widgetSettings = {} } = appOptions;
        this.appOptions = appOptions;
        this.isCsatRatingBase = widgetSettings?.csatRatingBase ? widgetSettings.csatRatingBase : 3;
        if (this.isCsatRatingBase == 5) {
            this.starCsatHtmlEnable();
        }
    }
    starCsatHtmlEnable = () => {
        kommunicateCommons.hide('.mck-smilies-inner');
        kommunicateCommons.show('.star-rating');
        kommunicateCommons.modifyClassList(
            {
                class: ['mck-ratings-smilies'],
            },
            'star-rating-extra',
            ''
        );
    };

    generateStarSvgs = function (rating) {
        const ratingSVGs = Array.from({ length: rating }, () => KommunicateConstants.STAR_SVG);
        return ratingSVGs.join('');
    };

    resetStarsColor = () => {
        const stars = document.querySelectorAll('.star-rating label');
        stars.forEach(function (star, index) {
            star.classList.remove('filled');
        });
    };

    setStarsEffect = (rating) => {
        const stars = document.querySelectorAll('.star-rating label');
        function highlightStars(index) {
            stars.forEach((star, i) => {
                star.classList.toggle('filled', i <= index);
            });
        }

        function removeHighlightFromStars() {
            document
                .querySelectorAll('.star-rating label.filled')
                .forEach((star) => star.classList.remove('filled'));
        }

        highlightStars(rating - 1);
        stars.forEach((star, index) => {
            star.addEventListener('mouseover', () => highlightStars(index));
            star.addEventListener('mouseout', () => {
                const isAnyRatingSelected = document.querySelector('.mck-rating-box.selected');
                if (!isAnyRatingSelected) {
                    removeHighlightFromStars();
                } else {
                    highlightStars(rating - 1);
                }
            });
            star.addEventListener('click', () => {
                rating = index + 1;
                highlightStars(index);
            });
        });
    };
}

const ratingService = new RatingService();
