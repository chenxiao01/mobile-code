const TIME_OUT = 10000;
const TO_BLOB_MIME_TYPE = 'image/jpeg';
const TO_BLOB_QUALITY = 0.8;

/**
 * 上传文件
 * @param {string} url 请求的url
 * @param {Object} params 请求的参数
 * @param {number} timeout 【可选】请求timeout等待时间
 * @return {Object} Promise
 */
function uploadImage(url, params, timeout = TIME_OUT) {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        Object.keys(params).map(key => {
            if (params[key] instanceof File) {
                formData.append(key, params[key]);
            }
            else if (params[key] instanceof Blob) {
                formData.append(key, params[key], params[key].type.replace('/', '.'));
            }
            else {
                formData.append(key, params[key]);
            }
        });

        let xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);

        xhr.timeout = timeout;
        xhr.onload = e => {
            resolve(JSON.parse(e.target.response));
        };
        xhr.onerror = xhr.ontimeout = e => {
            reject(e);
        };
        xhr.send(formData);
    });

};

/**
 * dataURL to blob, ref to https://gist.github.com/fupslot/5015897
 * @param dataURI
 * @returns {Blob}
 */
function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {type: mimeString});
}

export {uploadImage, dataURItoBlob}