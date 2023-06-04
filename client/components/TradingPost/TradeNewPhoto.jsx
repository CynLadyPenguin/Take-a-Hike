import React, { useState } from 'react';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

const TradeNewPhoto = ({ postTexts, user, uploadedPhoto, setUploadedPhoto }) => {

  // Specific presets, using dotenv-webpack plugin. When there's time need to convert this to a server-side request for security
const cloudName = process.env.CLOUDINARY_NAME;
const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
// console.log(cloudName, uploadPreset)


  const showWidget = () => {
    const myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: cloudName,
        uploadPreset: uploadPreset,
        maxFiles: 1,
        folder: "trade_images",
        tags: [`user:${user._id}`],
        maxImageFileSize: 2000000,
        maxImageWidth: 2000,
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          // console.log("Image posted to cloudify: ", result.info);
          setUploadedPhoto(result.info.secure_url);
        }
      }
    );
    myWidget.open();
  };

  return (
    uploadedPhoto ? <img src={uploadedPhoto} width="80" height="80" style={{ marginRight: "8px" }} /> :
    <AddPhotoAlternateIcon style={{ marginRight: "8px"}} sx={{ fontSize: 80, ":hover": {cursor: "pointer", }, }} onClick={showWidget} />
  );

};


export default TradeNewPhoto;
