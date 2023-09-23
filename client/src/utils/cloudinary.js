export const uploadToCloudinary =  (file, fileType = 'image') => {
  return new Promise(async (resolve, reject) => {
    try {
      const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'howdy-chat-app');
    formData.append('cloud_name', process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);
    
    const cloudinaryResponse = await fetch(
      process.env.REACT_APP_CLOUDINARY_API,
      {
        method: 'post',
        body: formData,
      }
    );
    
    const cloudinaryData = await cloudinaryResponse.json();
    resolve(cloudinaryData.secure_url.toString());
    } catch (err) {
      console.error('Error occured in uploading file to cloudinary ', err);
      reject()
    }
  })
};
