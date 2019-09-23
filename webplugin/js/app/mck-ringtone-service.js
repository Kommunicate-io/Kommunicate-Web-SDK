 function RingToneService() {
            var _this = this;
            _this.loadRingTone = function (url,notificationtoneoption) {
                return new Howl({
                    src: [url],
                    loop: notificationtoneoption.loop,
                    html5: true
                });
                return null;
            };
            _this.loadChatPopupTone = function(url) {
                return new Howl({
                    src: [url],
                    html5: true,
                    volume: 0.8
                });
            }
        }