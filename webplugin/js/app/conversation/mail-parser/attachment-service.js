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
        const fileName = kmUtils.sanitize(fileMeta.filename);
        anchor.innerHTML =
            '<span class="file-detail mck-image-download" title="' +
            fileName +
            '"><span class="mck-file-name"><span class="km-icon-attachment">' +
            KOMMUNICATE_CONSTANTS.ATTACHMENT_ICON.DEFAULT +
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
            imgElement.setAttribute('data-size', kmUtils.getFilePreviewSize(blob.size));

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
            video.setAttribute('data-size', kmUtils.getFilePreviewSize(blob.size));
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
        try {
            const fileBlob = new Blob([arrayBuffer], {
                type: attachment.mimeType,
            });
            return {
                url: URL.createObjectURL(fileBlob),
                fileSize: kmUtils.getFilePreviewSize(fileBlob.size),
            };
        } catch (error) {
            URL.revokeObjectURL(fileBlob);
            console.error('Failed to create other attachment', error);
        }
    }
}
