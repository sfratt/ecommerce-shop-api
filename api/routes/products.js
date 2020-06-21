const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Product = require("../models/product");

router.get("/", async (req, res, next) => {
    try {
        const results = await Product.find().select("name price _id").exec();
        const response = {
            count: results.length,
            products: results.map(result => {
                return {
                    // ...result,
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: "GET",
                        url: `${req.protocol}://${req.get("host")}/products/${result._id}`
                    }
                }
            })
        }
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
});

router.post("/", async (req, res, next) => {
    const { name, price } = req.body;
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: name,
        price: price
    });
    try {
        const result = await product.save();
        const response = {
            message: "Created product successfully",
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: "GET",
                    url: `${req.protocol}://${req.get("host")}/products/${result._id}`
                }
            }
        }
        res.status(201).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
});

router.get("/:productId", async (req, res, next) => {
    const id = req.params.productId;
    try {
        const result = await Product.findById(id).select("name price _id").exec();
        const response = {
            product: result,
            request: {
                type: "GET",
                url: `${req.protocol}://${req.get("host")}/products`
            }
        }
        if (result) {
            res.status(200).json(response);
        } else {
            res.status(404).json({ message: "No valid entry found for provided ID" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
});

router.patch("/:productId", async (req, res, next) => {
    const id = req.params.productId;
    const props = req.body;
    try {
        const result = await Product.updateOne({ _id: id }, props).exec();
        const response = {
            message: "Product updated",
            request: {
                type: "GET",
                url: `${req.protocol}://${req.get("host")}/products/${id}`
            }
        }
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
});

router.delete("/:productId", async (req, res, next) => {
    const id = req.params.productId;
    try {
        const result = await Product.remove({ _id: id }).exec();
        const response = {
            message: "Product deleted",
            request: {
                type: "POST",
                url: `${req.protocol}://${req.get("host")}/products`,
                body: { name: "String", price: "Number" }
            }
        }
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
});

module.exports = router;
