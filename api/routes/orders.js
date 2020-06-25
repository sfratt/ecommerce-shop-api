const express = require("express");
const mongoose = require("mongoose");
const createError = require("http-errors");
const router = express.Router();

const Product = require("../models/product");
const Order = require("../models/order");

router.get("/", async (req, res, next) => {
    try {
        const results = await Order
            .find()
            .select("-__v")
            .populate("product", "name")
            .exec();
        const response = {
            count: results.length,
            orders: results.map(result => {
                return {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity,
                    request: {
                        type: "GET",
                        url: `${req.protocol}://${req.get("host")}/orders/${result._id}`
                    }
                }
            })
        }
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

router.post("/", async (req, res, next) => {
    const { quantity, productId } = req.body;
    try {
        const product = await Product.findById(productId).exec();
        // if (!product) {
        //     throw createError(404, "Product not found");
        // }

        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: quantity,
            product: productId
        });
        const result = await order.save();
        const response = {
            message: "Order stored",
            createdOrder: {
                _id: result._id,
                product: result.product,
                quantity: result.quantity,
                request: {
                    type: "GET",
                    url: `${req.protocol}://${req.get("host")}/orders/${result._id}`
                }
            }
        }
        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
});

router.get("/:orderId", async (req, res, next) => {
    const id = req.params.orderId;
    try {
        const result = await Order
        .findById(id)
        .select("-__v")
        .populate("product")
        .exec();
        // if (!result) {
        //     throw createError(404, "Order not found");
        // }
        const response = {
            order: result,
            request: {
                type: "GET",
                url: `${req.protocol}://${req.get("host")}/products`
            }
        }
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

router.delete("/:orderId", async (req, res, next) => {
    const id = req.params.orderId;
    try {
        const result = await Order.remove({ _id: id }).exec();
        const response = {
            message: "Order deleted",
            // order: result,
            request: {
                type: "POST",
                url: `${req.protocol}://${req.get("host")}/products`,
                body: { productId: "ID", quantity: "Number" }
            }
        }
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
