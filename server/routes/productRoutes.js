import express from 'express';
import Product from '../models/Product.js';
import { admin, protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, admin, async (req, res) => {
    try {
        const { name, description, price, discountPrice, countInStock, category, brand, sizes, colors, collections, material, gender, images, isFeatured, isPublished, tags, dimensions, weight, sku } = req.body;
        const product = new Product({
            name, description, price, discountPrice, countInStock, category, brand, sizes, colors, collections, material, gender, images, isFeatured, isPublished, tags, dimensions, weight, sku, user: req.user._id
        }); //user: req.user._id -> Reference to the eadmin user who created it.
        const createdProduct = await product.save();
        res.status(201).json(createdProduct)
    } catch (error) {
        console.log(error);
        res.status(500).send("server error");
    }
});

router.put('/:id', protect, admin, async (req, res) => {
    try {
        const { name, description, price, discountPrice, countInStock, category, brand, sizes, colors, collections, material, gender, images, isFeatured, isPublished, tags, dimensions, weight, sku } = req.body;
        // Find product by id
        const product = await Product.findById(req.params.id);
        if (product) {
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.discountPrice = discountPrice || product.discountPrice;
            product.countInStock = countInStock || product.countInStock;
            product.category = category || product.category;
            product.brand = brand || product.brand;
            product.sizes = sizes || product.sizes;
            product.colors = colors || product.colors;
            product.collections = collections || product.collections;
            product.material = material || product.material;
            product.gender = gender || product.gender;
            product.images = images || product.images;
            product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
            product.isPublished = isPublished !== undefined ? isFeatured : product.isPublished;
            product.tags = tags || product.tags;
            product.dimensions = dimensions || product.dimensions;
            product.weight = weight || product.weight;
            product.sku = sku || product.sku;

            // save the updated product to database
            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(400).json({ message: "Product Not Found." })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("server error");
    }
});

router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.json({ message: "Product deleted" });
        } else {
            res.status(404).json({ message: "Product Not Found." })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("server error");
    }
});

router.get('/', async (req, res) => {
    console.log("QUERY:", req.query);
    try {
        const {
            collection,
            sizes,
            colors,
            gender,
            minPrice,
            maxPrice,
            sortBy,
            search,
            category,
            material,
            brand,
            limit,
        } = req.query;

        let query = {};

        if (collection && collection.toLowerCase() !== "all") {
            query.collections = collection;
        }

        if (category && category.toLowerCase() !== "all") {
            query.category = category;
        }

        if (material) {
            query.material = { $in: material.split(",") };
        }

        if (brand) {
            query.brand = { $in: brand.split(",") };
        }

        if (colors) {
            query.colors = { $in: colors.split(",") };
        }

        if (sizes) {
            query.sizes = { $in: sizes.split(",") };
        }

        if (gender) {
            query.gender = gender;
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        let sort = {};
        if (sortBy) {
            switch (sortBy) {
                case "priceAsc":
                    sort = { price: 1 };
                    break;
                case "priceDsc":
                    sort = { price: -1 };
                    break;
                case "popularity":
                    sort = { rating: -1 };
                    break;
                default:
                    break;
            }
        }

        const products = await Product.find(query).sort(sort).limit(Number(limit) || 0);
        return res.json(products);
    } catch (error) {
        console.error("Product filter error:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});



// Retrive the product with highest rating
router.get('/best-seller', async (req, res) => {
    try {
        const bestSeller = await Product.findOne().sort({ rating: -1 });
        if (bestSeller) {
            res.json(bestSeller);
        } else {
            res.status(404).json({ message: "No best sellers found." })
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("server error");
    }
});
// Retrive the New Arrivals
router.get('/new-arrivals', async (req, res) => {
    try {
        const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(8);
        res.json(newArrivals);
    } catch (error) {
        console.log(error);
        res.status(500).send("server error");
    }
})
// Getting similar products based on current product
router.get('/similar/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ messgae: "Product Not FOund." });
        }
        const similarProducts = await Product.find({
            _id: { $ne: id }, //Exclude current product id
            gender: product.gender,
            category: product.category,
        }).limit(4);
        res.json(similarProducts);
    } catch (error) {
        console.log(error);
        res.status(500).send("server error");
    }
});

// Get a single product by id
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ messgae: "Product Not Found." });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("server error");
    }
});



export default router;