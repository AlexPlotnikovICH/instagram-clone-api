import cloudinary from '../config/cloudinary.js';

export const uploadToCloudinary = (fileBuffer, folderName = 'ichgram') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folderName },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    uploadStream.end(fileBuffer);
  });
};