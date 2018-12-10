
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";

const  Notification = {
    info : function(message) {
    NotificationManager.info(message, "Info", 5000);
  },

  success:function(message) {
    NotificationManager.success(message, "Success", 5000);
  },
    warning : function(message,time) {
      var time =time?time:5000;
    NotificationManager.warning(message, "Warning", time);
  },

  error: function(message) {
    NotificationManager.error(message, "Error", 5000);
  }
  // NotificationManager.error('Error message', 'Click me!', 5000, () => {
  // alert('callback');
  // });
}

export default Notification;


