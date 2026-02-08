import mongoose from "mongoose";
import { config } from "dotenv";
import Product from "./models/Product.js";
import User from "./models/User.js";
import Cart from "./models/Cart.js";
import products from "./data/Products.js";

config();
mongoose.connect(process.env.MONGO_URI);

// Function to seed data
const seedData = async(req, res)=>{
    try{
        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany();
        // create a default Admin user
        const createUser = await User.create({
            name: "Manguli",
            email: "manguli@gmail.com",
            password: "Manguli@123",
            role: "admin",
        });
        // Assign the default user ID to each product
        const userID = createUser._id;
        const sampleProducts = products.map((product)=>{
            return {...product, user:userID};
        });
        // Insert the products into database
        await Product.insertMany(sampleProducts);
        console.log("Product data seeded successfully.");
        process.exit(1);
    }catch(error){
        console.log("Error in seeding data.",error);
        process.exit(1);
    }
};


seedData();