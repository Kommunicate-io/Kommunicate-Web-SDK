import { useEffect } from "react";
import React from "react";

const KommunicateChat = ({ mail }) => {
  useEffect(() => {
    if (window.kommunicate) {
      return;
    }
    (function (d, m) {
      var kommunicateSettings = {
        appId: "kommunicate-support",
        popupWidget: true,
        automaticChatOpenOnNavigation: true,
      };
      if ((mail ?? "").length > 0) {
        kommunicateSettings.email = mail;
      }
      var s = document.createElement("script");
      s.type = "text/javascript";
      s.async = true;
      s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
      var h = document.getElementsByTagName("head")[0];
      h.appendChild(s);
      window.kommunicate = m;
      m._globals = kommunicateSettings;
    })(document, window.kommunicate || {});
  }, [mail]);

  return <div></div>;
};

export default KommunicateChat;
