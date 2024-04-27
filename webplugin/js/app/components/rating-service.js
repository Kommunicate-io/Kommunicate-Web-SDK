class RatingService {
    constructor() {
        this.appOptions = {};
        this.isCsatRatingBase = 0;
    }
    init(appOptions = {}) {
        const { widgetSettings = {} } = appOptions;
        this.appOptions = appOptions;
        this.isCsatRatingBase = widgetSettings.csatRatingBase?widgetSettings.csatRatingBase:0;
        if(this.isCsatRatingBase == 5){
            this.csatHtmlEnable();
        }
    }
    csatHtmlEnable = () =>{
        $applozic('.mck-smilies-inner')
        .removeClass('vis')
        .addClass('n-vis');

        $applozic('.mck-ratings-smilies')
        .addClass('star-rating-extra');

        $applozic('.star-rating')
        .removeClass('n-vis')
        .addClass('vis');
    }
}

const ratingService = new RatingService();


