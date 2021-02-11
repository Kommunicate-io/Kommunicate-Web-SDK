const config = require("../config/config-env");
const FormData = require("form-data");
const fs = require("fs");
const fetch = require("node-fetch");
const path = require("path");
const argv = require("minimist")(process.argv.slice(2));
const KOMMUNICATE_BASE_URL = config.urls.kommunicateBaseUrl;
const AWS = config.thirdPartyIntegration.aws;
const FILE_UPLOAD_PATH = argv && argv.path;
/*
    We're using node-fetch to upload files for web-plugin server.
    What is node-fetch ?
    -> A light-weight module that brings window.fetch to Node.js
    
    How to pass params in fetch request ?
    -> Follow the below steps :
    1. Add module querystring (comes with node)
    - const qs = require("querystring");
    2. var url = new URL("http://Example.com/");
    // let params = {
    //     "a": "4"
    // };
    // url.search = qs.stringify(params);

    url = http://Example.com/?a=4
*/
exports.upload = async (buildDir, version) => {
    try {
        let buildFolder = fs.readdirSync(
            path.resolve(__dirname, "../../webplugin/build")
        );
        for (let file of buildFolder) {
            var filePath = path.resolve(
                __dirname,
                (buildDir + "/" + file).toString()
            );
            console.log(filePath);
            await uploadFileToS3(filePath, version);
        }
    } catch (error) {
        throw error;
    }
};

const uploadFileToS3 = async (filePath, folderName) => {
    try {
        let uploadUrl = KOMMUNICATE_BASE_URL + FILE_UPLOAD_PATH;
        let fileStream = fs.createReadStream(filePath);
        fileStream.on("error", function (err) {
            console.log("Error while reading file data", err);
        });
        let form = new FormData();
        form.append("key", folderName);
        form.append("bucket", AWS.bucket);
        form.append("cacheControl", "max-age=2628000");
        form.append("file", fileStream);

        await fetch(uploadUrl, {
            method: "POST",
            headers: form.getHeaders(),
            body: form,
        })
            .then((res) => res.json())
            .then((json) => {
                console.log(json);
            })
            .catch((error) => {
                throw error;
            });
    } catch (error) {
        throw error;
    }
};
