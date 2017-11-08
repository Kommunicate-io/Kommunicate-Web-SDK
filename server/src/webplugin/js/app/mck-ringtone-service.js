 function RingToneService() {
            var _this = this;
            _this.loadRingTone = function (url,notificationtoneoption) {
                return new Howl({
                    src: [url],
                    loop: notificationtoneoption.loop
                });
                return null;
            };
        }