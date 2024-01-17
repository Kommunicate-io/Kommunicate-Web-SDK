# Instructions to deploy Kommunicate on your server.

## Prerequisites:
- Node version: v10.16.0 or higher
- Git installed in the server machine.
- Clone Kommunicate-Web-SDK repository on your machine. ([How to clone a Github repository ?](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository))


## Steps to deploy Kommunicate server.
Step-1: Open Terminal on your machine.

Step-2: Change the current working directory to Kommunicate-Web-SDK directory.

Step-3: Open the terminal and run this command to install the dependencies
> $ npm install

Step-3: To run the Kommunicate-Web-SDK in local you need to run this command in terminal
> $ npm run dev


Step-5: Open your web browser and enter http://localhost:3030 to run the demo.

## How to point Kommunicate script to your server?

- Update the source URL in the Kommunicate script.
> s.src = "http://localhost:3030/v2/kommunicate.app";

```javascript
<script type="text/javascript">
    (function (d, m) {
        var kommunicateSettings = {
            "appId": "<APP_ID>", // replace with your application id which you can find from the install section in the dashboard.
            "automaticChatOpenOnNavigation": true,
            "popupWidget": true
        };
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.async = true;
        s.src = "http://localhost:3030/v2/kommunicate.app";
        var h = document.getElementsByTagName("head")[0];
        h.appendChild(s);
        window.kommunicate = m;
        m._globals = kommunicateSettings;
    })(document, window.kommunicate || {});
</script>

```
- You have to also update the hostUrl parameter in the config-env.js file as per your server host URL.
> Example : hostUrl: https://your.hosturl.io

> **Note**: Do not update any other parameter in config-env file other than hostUrl for all environments. 
 

