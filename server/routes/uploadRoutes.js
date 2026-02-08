import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import { config } from 'dotenv';

config();
const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log(cloudinary.config.api_key);

//Multer setup using memory storage
const storage=multer.memoryStorage();
const upload = multer({storage});


router.post('/',upload.single("image"), async (req, res)=>{
    try {
        if (!req.file){
            return req.status(404).json({messgae:"No file uploaded."});
        }
        // Function to hanlde stream upload to the cloudinary
        const streamUpload = (fileBuffer)=>{
            return new Promise((resolve, reject)=>{
                const stream = cloudinary.uploader.upload_stream((errorr, result)=>{
                    if (result){
                        resolve(result);
                    }else{
                        reject(error)
                    }
                });
                // Use streamifier to convert file buffer to stream
                streamifier.createReadStream(fileBuffer).pipe(stream);

            });
        };
        // Call the streamupload function
        const result = await streamUpload(req.file.buffer);
        // Respond with the upload image URL
        res.json({ imageUrl: result.secure_url})
    } catch (error) {
        console.log(error);
        res.status(500).json({messgae: "server error"});
    }
});

export default router;