const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const fs= require('fs')
dotenv.config();
var exportFuns = {};


exportFuns.getBcryptEncryption = (textStr) => {
    return bcrypt.hashSync(textStr, 10);
}

exportFuns.compareBcryptEncryption = (textStr, encryptText) => {
    return bcrypt.compareSync(textStr, encryptText);
}

exportFuns.getJwtEncryption = (dataObj = {}, expiresIn = process.env.JWT_EXPIRY) => {
    return jwt.sign(dataObj,process.env.JWTSECRET , {
        expiresIn: expiresIn
    });
}

exportFuns.getJwtDecryption = (authToken) => {

    try {
        return jwt.verify(authToken, process.env.JWTSECRET);
    } catch (err) {
        throw err.message;
    }
}

exportFuns.isFileTypeImage = (mimeType) => {
    var image_type_mimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    return image_type_mimeTypes.includes(mimeType);
};

exportFuns.uploadFile = (fileData, destPath= process.env.FILE_PATH) => {

    var fileName = Date.now() + fileData.name.replace(/[^0-9a-z.]/gi, '');
    var destFilePath = destPath + "/" + fileName;
    var file_data_bitmap = new Buffer.from(fileData.data, 'base64');

    fs.writeFileSync(destFilePath, file_data_bitmap, function (err) {
        if (err) { throw err; }
    });
    return fileName;
};

module.exports = exportFuns;