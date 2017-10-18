
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";

const  Notification = {
    info : function(message) {
    NotificationManager.info(message, "Info", 1000);
  },

  success:function(message) {
    NotificationManager.success(message, "Success", 1000);
  },
    warning : function(message) {
    NotificationManager.warning(message, "Warning", 1000);
  },

  error: function(message) {
    NotificationManager.error(message, "Error", 1000);
  }
  // NotificationManager.error('Error message', 'Click me!', 5000, () => {
  // alert('callback');
  // });
}

export default Notification;


