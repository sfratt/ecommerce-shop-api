const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Product = require("../models/product");

router.get("/", async (req, res, next) => {
    try {
        const result = await Product.find().exec();
        console.log(result);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
});

router.post("/", async (req, res, next) => {
    const { name, price } = req.body;
    const product = new Product({
        _id: mongoose.Types.ObjectId(),
        name: name,
        price: price
    });
    try {
        const result = await product.save();
        console.log(result);
        res.status(201).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
});

router.get("/:productId", async (req, res, next) => {
    const id = req.params.productId;
    try {
        const result = await Product.findById(id).exec();
        console.log(result);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "No valid entry found for provided ID" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
});

router.patch("/:productId", async (req, res, next) => {
    const id = req.params.productId;
    const props = req.body;
    try {
        const result = await Product.update({ _id: id }, props).exec();
        console.log(result);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
});

router.delete("/:productId", async (req, res, next) => {
    const id = req.params.productId;
    try {
        const result = await Product.remove({ _id: id }).exec();
        console.log(result);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
});

module.exports = router;
