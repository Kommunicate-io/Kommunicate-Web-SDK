# Instructions to deploy Kommunicate on your server.

## Prerequisites:
- Node version: v10.16.0 or higher
- Git installed in the server machine.
- Clone Kommunicate-Web-SDK repository on your machine. ([How to clone a Github repository ?](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository))


## How to run Kommunicate-Web-SDK in localhost.
Step 1: Open Terminal on your machine.

Step 2: Change the current working directory to Kommunicate-Web-SDK directory.

Step 3: Open the terminal and run this command to install the dependencies
> $ npm install

Step 4: To run the Kommunicate-Web-SDK in local you need to run this command in terminal
> $ npm run dev


Step-5: Open your web browser and enter http://localhost:3030 to run the demo.

## How to debug the Production Kommunicate-Web-SDK in localhost.

> Note -> These steps will be applicable for all environments like -> test, release, prod_in, prod etc. Please ensure that you update only the environment key and hostUrl

Step 1: Open the `config-env.js` file in Kommunicate-Web-SDK.

Step 2: Search for the `development:` key in `config-env.js` file and replace the `development -> _development`
> ![Screenshot 2024-01-17 at 11 34 03 AM](https://github.com/Kommunicate-io/Kommunicate-Web-SDK/assets/109517510/40228a67-9d68-4dae-b9ac-9e3d487e1e48)

Step 3: Search for the `prod:` key in `config-env.js` file and replace that key with `development`


> ![Screenshot 2024-01-17 at 11 36 12 AM](https://github.com/Kommunicate-io/Kommunicate-Web-SDK/assets/109517510/49774a67-ed72-40b7-8e23-67250eb85448)

Step 4: Replace the prod env `hostUrl:https:widget.kommunicate.io` to this `hostUrl: 'http://localhost:3030',`
>  ![Screenshot 2024-01-17 at 11 30 52 AM](https://github.com/Kommunicate-io/Kommunicate-Web-SDK/assets/109517510/d32a1f4d-69f0-4184-837a-3d595f5d2bb8)

Step 5: After changing the config variable open the terminal and run this command.
> $ npm run dev

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
 

