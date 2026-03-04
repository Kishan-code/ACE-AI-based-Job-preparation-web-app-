const ImageKit = require("@imagekit/nodejs");
const serverConfig = require("../config/server.config");

const client = new ImageKit({
  privateKey: serverConfig.IMAGEKIT_PRIVATE_KEY,
});

const uploadFile = async (file) => {
  try {
    const response = await client.files.upload({
      file: new File([file.buffer], file.originalname, { type: file.mimetype }),
      fileName: `profile-pictures/${Date.now()}-${file.originalname}`,
    });
    return response;
  } catch (error) {
    console.log("imagekit: ",error)
    error.statusCode = 500;
    error.message = "Failed to upload file";
    throw error;
  }
};

const deleteFile = async (fileId) => {
    try {
        const response = await client.files.delete(fileId);
        return response;
    } catch (error) {
        error.statusCode = 500;
        error.message = "Failed to delete file";
        throw error;
    }
};

module.exports = {
  uploadFile,
    deleteFile,
};
