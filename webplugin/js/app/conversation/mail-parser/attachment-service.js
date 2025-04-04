class AttachmentService {
    constructor() {
        this.attachmentService = null;
    }

    setAttachmentType(attachmentService) {
        this.attachmentService = attachmentService;
    }

    getAttachmentDownloadLink(fileMeta, src, fileSize) {
        const anchor = document.createElement('a');
        anchor.setAttribute('href', src);
        anchor.setAttribute('role', 'link');
        anchor.setAttribute('target', '_blank');
        anchor.setAttribute('class', 'file-preview-link');
        const fileName = DOMPurify.sanitize(fileMeta.filename);
        anchor.innerHTML =
            '<span class="file-detail mck-image-download" title="' +
            fileName +
            '"><span class="mck-file-name"><span class="km-icon-attachment">' +
            '<svg focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 16 18"  class="mck-icon-upload">' +
            '<path fill="#787474" fill-rule="nonzero" d="M2.79801641 16.79165738l.01279906.00769045c2.7142501 1.62062499 4.9765631.04219128 6.1885999-1.97497667.3270023-.54422324 1.55448623-2.58074521 2.79039798-4.63129344 1.25308361-2.079127 2.51480582-4.17263105 2.8555035-4.73964722.7850585-1.30655673.928768-3.12041452-1.02247594-4.29284017C12.4491118.45868356 11.49591165.61137697 10.9027726.8630112c-.85581269.36273948-1.35565745 1.08421422-1.53088846 1.37743617l-5.658368 9.39208556c-.70517184 1.17797162-.5235628 2.28122412.47371238 2.8804475.61996573.372513 1.2844719.37303855 1.87102157.00170976.42648918-.27015628.72709626-.67870968.90411746-.97371957l5.59414907-9.35431076c.14474987-.24209567.0661251-.55564877-.17547919-.70081928l-.00087665-.00052674c-.24244632-.14496057-.55649081-.06591517-.70134602.17635583l-5.59383301 9.35378475c-.09800968.16351264-.30334324.46394185-.57398283.63516794-.2604276.16495342-.50615497.16048317-.7970269-.01429032-.4921504-.2957138-.53361547-.79263778-.12370218-1.47723092l5.65857872-9.39243626c.12462827-.2086077.47507585-.71678977 1.0529514-.9620843.54569911-.23145859 1.1496441-.15277963 1.7951741.23318488 1.53886856.92464552 1.08150083 2.20688915.6716944 2.88892158-.34059233.56684084-1.60217382 2.65971354-2.85476605 4.7384199-1.23640317 2.05096895-2.46402775 4.08812214-2.79103011 4.63234546-.59595756.99183994-2.25554543 3.13550123-4.7874873 1.62370223l-.0112211-.00674232c-1.13350634-.68107932-1.6541578-1.56042484-1.5915647-2.68804318.03917501-.7073837.31716069-1.51157536.80397927-2.32535185l4.75213674-7.90491222c.14548655-.24213028.06728318-.5563847-.17467177-.70176591-.24213028-.14548655-.5563847-.06728319-.7017659.17467177l-4.75276886 7.9059642c-.57201106.95635488-.8995258 1.92240601-.94810117 2.79476154-.05812167 1.04630744.2573944 2.52281778 2.0866089 3.62192074z"/>' +
            '</svg>' +
            '</span>' +
            "<span class='eml-attachment-link'>" +
            fileName +
            ' ' +
            '(' +
            fileSize +
            ')' +
            '</span>' +
            '</span>';

        return anchor.outerHTML;
    }

    async getAttachment(attachment) {
        return await this.attachmentService.getAttachment(attachment);
    }
}

class ImageAttachmentService {
    constructor(attachmentService) {
        this.attachmentService = attachmentService;
    }

    async getAttachment(attachment) {
        const imgElement = await this.arrayBufferToImage(attachment.content, attachment);
        return (
            "<div class='eml-container eml-image-container'>" +
            imgElement.outerHTML +
            this.attachmentService.getAttachmentDownloadLink(
                attachment,
                imgElement.src,
                imgElement.dataset.size
            ) +
            '</div>'
        );
    }

    arrayBufferToImage(arrayBuffer, attachment) {
        return new Promise((resolve, reject) => {
            const blob = new Blob([arrayBuffer], { type: attachment.mimeType });

            const imgElement = document.createElement('img');

            imgElement.setAttribute('class', 'file-preview-link fancybox-media kmfancybox');
            imgElement.setAttribute('data-type', attachment.mimeType);
            imgElement.setAttribute('data-name', attachment.filename);
            imgElement.setAttribute('data-url', imgElement.src);
            imgElement.setAttribute('data-size', alFileService.getFilePreviewSize(blob.size));

            imgElement.onload = () => {
                resolve(imgElement);
            };
            imgElement.onerror = () => {
                URL.revokeObjectURL(blob);
                reject(new Error('Failed to load image'));
            };
            imgElement.src = URL.createObjectURL(blob);
        });
    }
}

class VideoAttachmentService {
    constructor(attachmentService) {
        this.attachmentService = attachmentService;
    }

    async getAttachment(attachment) {
        const videoElement = await this.arrayBufferToVideo(attachment.content, attachment);
        return (
            "<div class='eml-container eml-image-container'>" +
            videoElement.outerHTML +
            this.attachmentService.getAttachmentDownloadLink(
                attachment,
                videoElement.src,
                videoElement.dataset.size
            ) +
            '</div>'
        );
    }

    arrayBufferToVideo(arrayBuffer, attachment) {
        // Create object URL directly instead of using FileReader
        const blob = new Blob([arrayBuffer], {
            type: attachment.mimeType || 'video/mp4',
        });
        const objectUrl = URL.createObjectURL(blob);

        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.controls = true;
            video.preload = 'metadata'; // Only load metadata initially
            video.setAttribute('data-size', alFileService.getFilePreviewSize(blob.size));
            // Use loadedmetadata instead of loadeddata for faster loading
            video.addEventListener(
                'loadedmetadata',
                () => {
                    resolve(video);
                },
                { once: true }
            ); // Use once:true for automatic cleanup

            video.addEventListener(
                'error',
                () => {
                    URL.revokeObjectURL(objectUrl);
                    reject(new Error('Failed to load video'));
                },
                { once: true }
            );

            video.src = objectUrl;
        });
    }
}

class OtherAttachmentService {
    constructor(attachmentService) {
        this.attachmentService = attachmentService;
    }

    async getAttachment(attachment) {
        const { url, fileSize } = this.arrayBufferToOtherAttachment(attachment.content, attachment);

        const container = document.createElement('div');
        container.setAttribute('class', 'eml-container eml-other-attachment-container');
        container.setAttribute('data-size', fileSize);

        container.innerHTML = this.attachmentService.getAttachmentDownloadLink(
            attachment,
            url,
            fileSize
        );

        return container.outerHTML;
    }

    arrayBufferToOtherAttachment(arrayBuffer, attachment) {
        let fileBlob;
        try {
            fileBlob = new Blob([arrayBuffer], {
                type: attachment.mimeType,
            });
            return {
                url: URL.createObjectURL(fileBlob),
                fileSize: alFileService.getFilePreviewSize(fileBlob.size),
            };
        } catch (error) {
            URL.revokeObjectURL(fileBlob);
            console.error('Failed to create other attachment', error);
        }
    }
}
