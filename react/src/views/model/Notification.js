
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";

const  Notification = {
    info : function(message) {
    NotificationManager.info(message, "Info", 1500);
  },

  success:function(message) {
    NotificationManager.success(message, "Success", 1500);
  },
    warning : function(message) {
    NotificationManager.warning(message, "Warning", 1500);
  },

  error: function(message) {
    NotificationManager.error(message, "Error", 1500);
  }
  // NotificationManager.error('Error message', 'Click me!', 5000, () => {
  // alert('callback');
  // });
}

export default Notification;


