import moment from 'moment';

const DateTimeUtils = {

    lastSeenTime: function(lastSeenAtTime) {
        var lastSeen;
        var minInTwoDays = 2880;
        var date = new Date(lastSeenAtTime);
        var currentDate = new Date();
        var diff = Math.abs(currentDate - date);
        var minutes = Math.floor((diff / 1000) / 60);
        if (minutes < minInTwoDays) {
          if (minutes < 60) {
            lastSeen = moment.unix(lastSeenAtTime / 1000).fromNow();
          } else {
            var hour = Math.floor(minutes / 60)
            lastSeen = hour + " hrs ago";
          }
        } else {
          lastSeen = moment.unix(lastSeenAtTime / 1000).format("DD MMMM YYYY");
        }
        return lastSeen;
    },

    /*
    - Pass number of days you want to calculate forward to in countTo variable.
    - Below are values you can pass in type parameter: 
    type : years/quarters/months/weeks/days/hours/minutes/seconds/milliseconds/timestamp
    */
   countDaysForward: function(countTo, type) {
        var months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

        if(type === "timestamp") {
            countTo = countTo*1000;
            var date = new Date(countTo)
            date.setDate(date.getDate());
            var dd = date.getDate();
            var mm = date.getMonth() + 1;
            mm = months[mm - 1];
            var y = date.getFullYear();
            var calculatedDate = dd + ' ' + mm + ', '+ y;
            return calculatedDate;
        }
        else {
            return moment().add(countTo, type).format("D MMMM, YYYY");
        }
    }
}

export default DateTimeUtils;
