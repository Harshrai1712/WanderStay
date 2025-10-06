const fs = require("fs");
const path = require("path");

const uploadPhotoFromDevice = async (req, res, next) => {
    try {
        const uploadedFiles = [];
        const parentDirectory = path.resolve(__dirname, "../../");
        const PATH_TO_UPLOADS = path.join(parentDirectory, "/assets/uploads/");
        
        for (let i = 0; i < req.files.length; i++) {
            const { path: filePath, originalname } = req.files[i];
            const parts = originalname.split(".");
            console.log(parts);
            const extension = parts[parts.length - 1];
            const newPath = filePath + "." + extension;
            fs.renameSync(filePath, newPath);
            
            // Extract just the filename by replacing the full path
            const filename = path.basename(newPath);
            uploadedFiles.push(filename);
        }
        console.log('Uploaded files:', uploadedFiles);
        res.json(uploadedFiles);
    } catch (error) {
        console.error('Upload error:', error);
        next(error)
    }
};

module.exports = uploadPhotoFromDevice;
