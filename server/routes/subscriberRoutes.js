import express from 'express';
import Subscriber from '../models/Subscriber.js';
const router = express.Router();

// Handle newsLetter subscription
router.post("/subscribe", async(req, res)=>{
    const { email } = req.body;
    if (!email){
        return res.status(400).json({message: "email is required"});
    }
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({message: "Invalid email format"});
    }
    try {
        let subscriber = await Subscriber.findOne({ email });
        if (subscriber){
            return res.status(400).json({message: "email is already subscribed"});
        }
        // create a new subscriber
        subscriber =  new Subscriber({ email });
        await subscriber.save();
        res.status(201).json({message: "Successfully subscribed to the newsLetter!"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "server error"});
    }
});

export default router;