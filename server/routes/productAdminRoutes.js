import e from "express";
import Product from "../models/Product.js";
import { protect, admin } from "../middleware/auth.js";

const router = e.Router();
// Get all products (admin only)
router.get('/',protect,admin,async(req, res)=>{
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "server error"});
    }
});

export default router;