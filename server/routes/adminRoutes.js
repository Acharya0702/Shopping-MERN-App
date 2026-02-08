import express from 'express';
import User from '../models/User.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Get all users (admin only)
router.get('/', protect, admin, async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ messgae: "server error" });
    }
});

// Adding a new user (admin only)
router.post('/', protect, admin, async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ messgae: "User already exists." });
        }
        user = new User({
            name, email, password, role: role || "customer",
        });
        await user.save();
        res.status(201).json({messgae: "User craeted successfully", user});
    } catch (error) {
        console.log(error);
        res.status(500).json({ messgae: "server error" });
    }
});

// Udate userInfo {name, email, role} (admin only)
router.put('/:id', protect, admin, async(req, res)=>{
    try {
        const user = await User.findById(req.params.id);
        if (user){
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.role = req.body.role || user.role;
        }
        const updatedUser = await user.save();
        res.json({messgae: "User updated successfully", user: updatedUser});
    } catch (error) {
        console.log(error);
        res.status(500).json({messgae: "server error"});
    }
});

// Delete a user (admin only)
router.delete('/:id', protect, admin, async(req, res)=>{
    try {
        const user = await User.findById(req.params.id);
        if (user){
            await user.deleteOne();
            res.json({messgae: "User deleted successfully"});
        }else{
            res.status(404).json({messgae:"user Not Found."});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({messgae: "server error"})
    }
})
export default router;