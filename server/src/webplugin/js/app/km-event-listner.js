Kommunicate.initilizeEventListners = function () {
    w.addEventListener('online', function () {
        Kommunicate.internetStatus = true;
    });
    w.addEventListener('offline', function () {
        Kommunicate.internetStatus = false;
    });
}