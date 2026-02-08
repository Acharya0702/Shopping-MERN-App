import express from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
const getCart = async (userId, guestId) => {
    if (userId) {
        return await Cart.findOne({ user: userId });
    } else if (guestId) {
        return await Cart.findOne({ guestId });
    }
    return null;
};
router.post('/', async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product Not Found." });
        }
        // Determine the user is logged in or guest
        let cart = await getCart(userId, guestId);
        // if the cart exists, update it
        if (cart) {
            const productIndex = cart.products.findIndex((p) => p.productId.toString() === productId && p.size === size && p.color === color);
            if (productIndex > -1) {
                // If the product already exists, update quantity
                cart.products[productIndex].quantity += quantity;
            } else {
                // Add new product
                cart.products.push({
                    productId,
                    name: product.name,
                    image: product.images[0].url,
                    price: product.price,
                    size,
                    color,
                    quantity,
                });
            }
            // Recalculate the total price
            cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
            await cart.save();
            return res.status(200).json(cart);
        } else {
            // create new cart for guest or user
            const newCart = await Cart.create({
                user: userId ? userId : undefined,
                guestId: guestId ? guestId : "guest_" + new Date().getTime(),
                products: [{
                    productId,
                    name: product.name,
                    image: product.images[0].url,
                    price: product.price,
                    size,
                    color,
                    quantity,
                }],
                totalPrice: product.price * quantity,
            });
            return res.status(201).json(newCart);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "server error" });
    }
});

// Updating products in cart
router.put('/', async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;
    try {
        let cart = await getCart(userId, guestId);
        if (!cart) return res.status(404).json({ message: "Cart Not FOund." });
        // if the cart exists, update it
        const productIndex = cart.products.findIndex((p) => p.productId.toString() === productId && p.size === size && p.color === color);
        if (productIndex > -1) {
            // update quantity
            if (quantity > 0) {
                cart.products[productIndex].quantity = quantity;
            } else {
                cart.products.splice(productIndex, 1); // Remove product if quantity is 0
            }
            cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
            await cart.save();
            return res.status(200).json(cart);
        } else {
            req.status(404).json({ messgae: "Product Not Found in Cart" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "server error" });
    }
});

// Deleting products from cart
router.delete('/', async (req, res) => {
    const { productId, size, color, guestId, userId } = req.body;
    try {
        let cart = await getCart(userId, guestId);
        if (!cart) return res.status(404).json({ message: "Cart Not FOund." });
        // if the cart exists, update it
        const productIndex = cart.products.findIndex((p) => p.productId.toString() === productId && p.size === size && p.color === color);
        if (productIndex > -1) {
            // Removing products
            cart.products.splice(productIndex, 1);
            cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
            await cart.save();
            return res.status(200).json(cart);
        } else {
            res.status(404).json({ messgae: "Product Not Found in Cart" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "server error" });
    }
});

// Get logged in user's or guest user's cart
router.get("/", async (req, res) => {
    const { userId, guestId } = req.query;
    try {
        const cart = await getCart(userId, guestId);
        if (cart) {
            res.json(cart);
        } else {
            res.status(404).json({ message: "Cart Not Found." });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "server error" });
    }
});

// Merge guest cart into user cart after login
router.post('/merge', protect, async (req, res) => {
    const { guestId } = req.body;
    try {
        const guestCart = await Cart.findOne({ guestId });
        const userCart = await Cart.findOne({ user: req.user._id });
        if (guestCart) {
            if (guestCart.products.length === 0) {
                return res.status(400).json({ messgae: "Gueat Cart is Empty." });
            } if (userCart) {
                // Merge guestCart into userCart
                guestCart.products.forEach((guestItem) => {
                    const productIndex = userCart.products.findIndex((item) => itme.productId.toString() === guestItem.productId.toString() && item.size === guestItem.size && guestItem.color);
                    if (productIndex > -1){
                        userCart.products[productIndex].quantity += guestItem.quantity;
                    }else{
                        userCart.products.push(guestItem);
                    }
                });
                userCart.totalPrice = userCart.products.reduce((acc, item)=>acc + item.price * item.quantity, 0);
                await userCart.save();
                // Remove the guestCart after merging
                try {
                    await Cart.findOneAndDelete({guestId});
                } catch (error) {
                    console.log("Error while deleting guestCart: ",error);
                }
                res.status(200).json(userCart);
            }else{
                // If the user has no existing cart assign guestCart to user
                guestCart.user = req.user._id;
                guestCart.guestId = undefined;
                await guestCart.save();
                res.status(200).json(guestCart);
            }
        }else{
            if (userCart){
                // guestCart has already been merged return userCart
                return res.status(200).json(userCart);
            }
            res.status(404).json({messgae: "Guest cart not found"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({messgae:"server error"});
    }
})
export default router;