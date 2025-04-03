// https://github.com/papnkukn/eml-format/blob/master/lib/eml-format.js
class EmlBuilder {
    guid() {
        return 'xxxxxxxxxxxx-4xxx-yxxx-xxxxxxxxxxxx'
            .replace(/[xy]/g, function (c) {
                var r = (Math.random() * 16) | 0,
                    v = c == 'x' ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            })
            .replace('-', '');
    }
    //Word-wrap the string 's' to 'i' chars per row
    wrap = (s, i) => {
        var a = [];
        do {
            a.push(s.substring(0, i));
        } while ((s = s.substring(i, s.length)) != '');
        return a.join('\r\n');
    };

    build(data) {
        var eml = '';
        var EOL = '\r\n'; //End-of-line

        try {
            if (!data || typeof data != 'object') {
                throw new Error("Argument 'data' expected to be an object!");
            }

            if (!data.headers) {
                data.headers = {};
            }

            if (typeof data.subject == 'string') {
                data.headers['Subject'] = data.subject;
            }

            if (typeof data.from != 'undefined') {
                data.headers['From'] =
                    typeof data.from == 'string' ? data.from : emlformat.toEmailAddress(data.from);
            }

            if (typeof data.to != 'undefined') {
                data.headers['To'] =
                    typeof data.to == 'string' ? data.to : emlformat.toEmailAddress(data.to);
            }

            if (typeof data.cc != 'undefined') {
                data.headers['Cc'] =
                    typeof data.cc == 'string' ? data.cc : emlformat.toEmailAddress(data.cc);
            }

            if (!data.headers['To']) {
                throw new Error("Missing 'To' e-mail address!");
            }

            var boundary = '----=' + this.guid();
            if (typeof data.headers['Content-Type'] == 'undefined') {
                data.headers['Content-Type'] =
                    'multipart/mixed;' + EOL + 'boundary="' + boundary + '"';
            } else {
                var name = emlformat.getBoundary(data.headers['Content-Type']);
                if (name) {
                    boundary = name;
                }
            }

            //Build headers
            var keys = Object.keys(data.headers);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var value = data.headers[key];
                if (typeof value == 'undefined') {
                    continue; //Skip missing headers
                } else if (typeof value == 'string') {
                    eml += key + ': ' + value.replace(/\r?\n/g, EOL + '  ') + EOL;
                } else {
                    //Array
                    for (var j = 0; j < value.length; j++) {
                        eml += key + ': ' + value[j].replace(/\r?\n/g, EOL + '  ') + EOL;
                    }
                }
            }

            //Start the body
            eml += EOL;

            //Plain text content
            if (data.text) {
                eml += '--' + boundary + EOL;
                eml += 'Content-Type: text/plain; charset=utf-8' + EOL;
                eml += EOL;
                eml += data.text;
                eml += EOL + EOL;
            }

            //HTML content
            if (data.html) {
                eml += '--' + boundary + EOL;
                eml += 'Content-Type: text/html; charset=utf-8' + EOL;
                eml += EOL;
                eml += data.html;
                eml += EOL + EOL;
            }

            //Append attachments
            if (data.attachments) {
                for (var i = 0; i < data.attachments.length; i++) {
                    var attachment = data.attachments[i];
                    eml += '--' + boundary + EOL;
                    eml +=
                        'Content-Type: ' +
                        (attachment.contentType || 'application/octet-stream') +
                        EOL;
                    eml += 'Content-Transfer-Encoding: base64' + EOL;
                    eml +=
                        'Content-Disposition: ' +
                        (attachment.inline ? 'inline' : 'attachment') +
                        '; filename="' +
                        (attachment.filename || attachment.name || 'attachment_' + (i + 1)) +
                        '"' +
                        EOL;
                    if (attachment.cid) {
                        eml += 'Content-ID: <' + attachment.cid + '>' + EOL;
                    }
                    eml += EOL;
                    if (typeof attachment.data == 'string') {
                        var content = kmUtils.convertToBuffer(attachment.data).toString();
                        eml += this.wrap(content, 76) + EOL;
                    } else {
                        //Buffer
                        var content = attachment.data.toString('base64');
                        eml += this.wrap(content, 76) + EOL;
                    }
                    eml += EOL;
                }
            }

            //Finish the boundary
            eml += '--' + boundary + '--' + EOL;

            return eml;
        } catch (e) {
            throw e;
        }
    }

    async getEmlFile(data) {
        const emlData = this.build(data);

        return new Promise((resolve, reject) => {
            try {
                const blob = new Blob([emlData], { type: 'message/rfc822' });
                const uuid = this.guid();
                const emlConvertTime = new Date().getTime();

                const fileName = emlConvertTime + '-mail-content-' + uuid + '.eml';

                // Create a file object with the Blob (simulate the file with name and content)
                const file = new File([blob], fileName, {
                    type: 'message/rfc822',
                });
                resolve({ file, key: uuid, emlConvertTime });
            } catch (e) {
                reject(e);
            }
        });
    }
}

const kmEmlBuilder = new EmlBuilder();
