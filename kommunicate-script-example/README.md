# Readme

## This demo is for making the chat widget full screen or adding it inside a container.

### Make widget fullscreen

To make the Kommunicate widget Full screen, replace the default script code with the following code as the changes are made inside the `onInit: function() { ... }` of the `kommunicateSettings` variable.
Example:

```javascript
<script type="text/javascript">
        (function (d, m) {
            var kommunicateSettings = {
                "appId": "<APP_ID>",
                "onInit": function () {
                    var iframeStyle = document.createElement('style');
                    var classSettings = ".change-kommunicate-iframe-height{height:100%!important;width:100%!important;right:0!important;bottom:0!important;max-height: 100%!important;}";
                    iframeStyle.type = 'text/css';
                    iframeStyle.innerHTML = classSettings;
                    document.getElementsByTagName('head')[0].appendChild(iframeStyle);
                    var launcherIconStyle = "@media(min-width: 510px){.mck-sidebox.fade.in,.mck-box .mck-box-sm{width:100%; height:100%;max-height:100%!important;border-radius:0px!important;}.mck-sidebox{right:0!important;bottom:0!important;}}";
                    Kommunicate.customizeWidgetCss(launcherIconStyle);

                    var iframe = parent.document.getElementById("kommunicate-widget-iframe"),
                        launcher = KommunicateGlobal.document.getElementById('mck-sidebox-launcher'),
                        preChatPopup = KommunicateGlobal.document.querySelector('#chat-popup-widget-container .chat-popup-widget-text-wrapper'),
                        closeButton = KommunicateGlobal.document.getElementById('km-chat-widget-close-button');

                    [launcher, preChatPopup].forEach(function (element) {
                        element && element.addEventListener('click', function () {
                            iframe.classList.add("change-kommunicate-iframe-height");
                        });
                    });

                    closeButton.addEventListener('click', function () {
                        iframe.classList.remove("change-kommunicate-iframe-height");
                    });
                }
            };
            var s = document.createElement("script"); s.type = "text/javascript"; s.async = true;
            s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
            var h = document.getElementsByTagName("head")[0]; h.appendChild(s);
            window.kommunicate = m; m._globals = kommunicateSettings;
        })(document, window.kommunicate || {});
</script>
```

> **Note:** Replace the `<APP_ID>` with the `appId` copied from the <a href="https://dashboard.kommunicate.io/settings/install" target="_blank">Install Section</a> from the Kommunicate Dashboard.

### Make chat widget fullscreen on pageload

To make the Kommunicate chat widget Full screen on page-load, replace the default script code with the following code as the changes are made the inside the `onInit: function() { ... }` of the `kommunicateSettings` variable.

> **Note:** Replace the `<APP_ID>` with the `appId` copied from the <a href="https://dashboard.kommunicate.io/settings/install" target="_blank">Install Section</a> from the Kommunicate Dashboard.

Example:

```javascript
<script type="text/javascript">
	(function (d, m) {
            var kommunicateSettings = {
                "appId": "<APP_ID>",
                "onInit": function () {
                    var iframeStyle = document.createElement('style');
                    var classSettings = ".change-kommunicate-iframe-height{height:100%!important;width:100%!important;right:0!important;bottom:0!important;max-height: 100%!important;}";
                    iframeStyle.type = 'text/css';
                    iframeStyle.innerHTML = classSettings;
                    document.getElementsByTagName('head')[0].appendChild(iframeStyle);
                    var launcherIconStyle = "@media(min-width: 510px){.mck-sidebox.fade.in,.mck-box .mck-box-sm{width:100%; height:100%;max-height:100%!important;border-radius:0px!important;}.mck-sidebox{right:0!important;bottom:0!important;}}";
                    Kommunicate.customizeWidgetCss(launcherIconStyle);

                    var iframe = parent.document.getElementById("kommunicate-widget-iframe"),
                        launcher = KommunicateGlobal.document.getElementById('mck-sidebox-launcher'),
                        preChatPopup = KommunicateGlobal.document.querySelector('#chat-popup-widget-container .chat-popup-widget-text-wrapper'),
                        closeButton = KommunicateGlobal.document.getElementById('km-chat-widget-close-button');

                    [launcher, preChatPopup].forEach(function (element) {
                        element && element.addEventListener('click', function () {
                            iframe.classList.add("change-kommunicate-iframe-height");
                        });
                    });

                    closeButton.addEventListener('click', function () {
                        iframe.classList.remove("change-kommunicate-iframe-height");
                    });
                    Kommunicate.launchConversation();
                    KommunicateGlobal.document.getElementById('mck-sidebox-launcher').click()
                }
            };
            var s = document.createElement("script"); s.type = "text/javascript"; s.async = true;
            s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
            var h = document.getElementsByTagName("head")[0]; h.appendChild(s);
            window.kommunicate = m; m._globals = kommunicateSettings;
        })(document, window.kommunicate || {});
</script>

```

> **Note:** Replace the `<APP_ID>` with the `appId` copied from the <a href="https://dashboard.kommunicate.io/settings/install" target="_blank">Install Section</a> from the Kommunicate Dashboard.

### Make chat widget fullscreen on pageload

To make the Kommunnicate chat widget Full screen on page-load copy & paste the following code inside the `onInit: function() { ... }` of the `kommunicateSettings` variable.

> **Note:** Replace the `<APP_ID>` with the `appId` copied from the <a href="https://dashboard.kommunicate.io/settings/install" target="_blank">Install Section</a> from the Kommunicate Dashboard.

Example:

```javascript
(function (d, m) {
    var kommunicateSettings = {
        appId: '<APP_ID>',
        onInit: function () {
            var iframeStyle = document.createElement('style');
            var classSettings =
                '.change-kommunicate-iframe-height{height:100%!important;width:100%!important;right:0!important;bottom:0!important;max-height: 100%!important;}';
            iframeStyle.type = 'text/css';
            iframeStyle.innerHTML = classSettings;
            document.getElementsByTagName('head')[0].appendChild(iframeStyle);
            var launcherIconStyle =
                '@media(min-width: 510px){.mck-sidebox.fade.in,.mck-box .mck-box-sm{width:100%; height:100%;max-height:100%!important;border-radius:0px!important;}.mck-sidebox{right:0!important;bottom:0!important;}}';
            Kommunicate.customizeWidgetCss(launcherIconStyle);

            var iframe = parent.document.getElementById('kommunicate-widget-iframe'),
                launcher = KommunicateGlobal.document.getElementById('mck-sidebox-launcher'),
                preChatPopup = KommunicateGlobal.document.querySelector(
                    '#chat-popup-widget-container .chat-popup-widget-text-wrapper'
                ),
                closeButton = KommunicateGlobal.document.getElementById(
                    'km-chat-widget-close-button'
                );

            [launcher, preChatPopup].forEach(function (element) {
                element &&
                    element.addEventListener('click', function () {
                        iframe.classList.add('change-kommunicate-iframe-height');
                    });
            });

            closeButton.addEventListener('click', function () {
                iframe.classList.remove('change-kommunicate-iframe-height');
            });
            Kommunicate.launchConversation();
            KommunicateGlobal.document.getElementById('mck-sidebox-launcher').click();
        },
    };
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = 'https://widget.kommunicate.io/v2/kommunicate.app';
    var h = document.getElementsByTagName('head')[0];
    h.appendChild(s);
    window.kommunicate = m;
    m._globals = kommunicateSettings;
})(document, window.kommunicate || {});
```

### Add widget in a container

To add the widget in a container create a `.html` file and paste the kommunicate script in the `<body>` tag. Then load that `.html` file in the `<iframe>` and put that `<iframe>` inside any container like a `<div>` tag in your website.

Example:

```html
<!-- Add the below code in the km-script.html file.  -->
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>Kommunicate Script</title>
    </head>
    <body>
        <script type="text/javascript">
            (function (d, m) {
                var kommunicateSettings = {
                    appId: '<APP_ID>',
                    onInit: function () {
                        Kommunicate.launchConversation(); // To launch the chat widget
                    },
                };
                var s = document.createElement('script');
                s.type = 'text/javascript';
                s.async = true;
                s.src = 'https://widget.kommunicate.io/v2/kommunicate.app';
                var h = document.getElementsByTagName('head')[0];
                h.appendChild(s);
                window.kommunicate = m;
                m._globals = kommunicateSettings;
            })(document, window.kommunicate || {});
        </script>
    </body>
</html>
```

```html
<!-- Add the below code in your website's section where you would like to show the chat widget. -->
<div class="km-script-container">
    <iframe src="/km-script.html" frameborder="0" style="height:100%; width:100%;"></iframe>
</div>
```

```css
/* Styling for the parent container of the iframe  */
.km-script-container {
    height: 350px;
    width: 100%;
}
```
