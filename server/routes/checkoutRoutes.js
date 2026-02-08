import express from 'express';
import Checkout from '../models/Checkout.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Order from '../models/Orders.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
// Crate a new Checkout Session
router.post("/", protect, async (req, res) => {
    const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;
    if (!checkoutItems || checkoutItems.length === 0) {
        return res.status(400).json({ messgae: "No items in checkout" });
    }
    try {
        const newCheckout = await Checkout.create({
            user: req.user._id,
            checkoutItems: checkoutItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            paymentStatus: "Pending",
            isPaid: false,
        });
        console.log(`Checkout created for user ${req.user._id}`);
        res.status(201).json(newCheckout);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "server error" });
    }
});


// Update checkout to mark as paid after successful payment
router.put('/:id/pay', protect, async (req, res) => {
    const { paymentStatus, paymentDetails } = req.body;
    try {
        const checkout = await Checkout.findById(req.params.id);
        if (!checkout) {
            return res.status(404).json({ messgae: "Checkout Not Found" });
        }
        if (paymentStatus === "Paid") {
            checkout.isPaid = true;
            checkout.paymentStatus = paymentStatus;
            checkout.paymentDetails = paymentDetails;
            checkout.paidAt = Date.now();
            await checkout.save();
            res.status(200).json(checkout);
        } else {
            res.status(400).json({ message: "Invalid payment status" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ messgae: "server error" });
    }
});

// Finalize checkout and convert it to an odrer after payment confirmation
router.post('/:id/finalize', protect, async (req, res) => {
    try {
        const checkout = await Checkout.findById(req.params.id);
        if (!checkout) {
            return res.status(404).json({ messgae: "Checkout Not Found." });
        } if (checkout.isPaid && !checkout.isFinalized) {
            // create final order based on the checkout details
            const finalOrder = await Order.create({
                user: checkout.user,
                orderItems: checkout.checkoutItems,
                shippingAddress: checkout.shippingAddress,
                paymentMethod: checkout.paymentMethod,
                totalPrice: checkout.totalPrice,
                isPaid: true,
                paidAt: checkout.paidAt,
                isDelivered: false,
                paymentStatus: "Paid",
                paymentDetails: checkout.paymentDetails,
            });
            // Mark the checkout as finalized
            checkout.isFinalized = true;
            checkout.FinalizedAt = Date.now();
            await checkout.save();
            //Delete the cart associated with the user
            await Cart.findOneAndDelete({ user: checkout.user });
            res.status(201).json(finalOrder);
        } else if (checkout.isFinalized) {
            res.status(400).json({ messgae: "Checkout already finalized" });
        } else {
            res.status(400).json({ messgae: "Checkout is not paid" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ messgae: "server error" });
    }
});

export default router;

