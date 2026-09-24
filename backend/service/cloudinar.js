const cloudinary = require('../config/cloudinary');

function upload_image(file) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: 'seg/products',
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }

                resolve(result);
            }
        );

        stream.end(file.buffer);
    });
}

module.exports = {
    upload_image,
};