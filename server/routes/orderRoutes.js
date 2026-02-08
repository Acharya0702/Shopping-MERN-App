import express from "express";
import Order from "../models/Orders.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Get logged-in users order
router.get('/my-orders', protect, async(req, res)=>{
    try {
        // Find orders for the authenticated user
        const orders = await Order.find({user: req.user._id}).sort({createdAt: -1});
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "server error"});
    }
});

// Get orderDetails by Id
router.get('/:id', protect, async(req, res)=>{
    try {
        const order = await Order.findById(req.params.id).populate("user", "name email");
        if (!order){
            return res.status(404).json({message:"Order not found"});
        }
        // Return the full order details
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

export default router;