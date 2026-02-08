import e from "express";
import Order from "../models/Orders.js";
import { protect, admin } from "../middleware/auth.js";

const router = e.Router();
// Get all orders
router.get('/', protect, admin, async(req, res)=>{
    try {
        const orders = await Order.find({}).populate("user","name, email");
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "server error"});
    }
});

// update order status (admin only)
router.put('/:id',protect,admin, async(req, res)=>{
    try {
        const order = await Order.findById(req.params.id).populate("user", "name");
        if (order){
            order.status = req.body.status || order.status;
            order.isDelivered = req.body.status === "Delivered" ? true : order.isDelivered;
            order.deliveredAt = req.body.status === "Delivered" ? Date.now() : order.deliveredAt;
            const updateOrder = await order.save();
            res.json(updateOrder);
        }else{
            res.status(404).json({message: "Order Not Found"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "server error"});
    }
});

// Deleting an Order (admin only)
router.delete('/:id',protect, admin, async(req, res)=>{
    try {
        const order = await Order.findById(req.params.id);
        if (order){
            await order.deleteOne();
            res.json({messgae: "Order removed"});
        }else{
            res.json({message: "Odrer Not Found"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({messgae: "server error"});
    }
})

export default router;