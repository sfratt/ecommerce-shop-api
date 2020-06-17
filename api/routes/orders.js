const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
    res.status(200).json({
        message: "Orders were fetched"
    });
});

router.post("/", (req, res, next) => {
    res.status(201).json({
        message: "Orders were created"
    });
});

router.get("/:orderId", (req, res, next) => {
    const id = req.params.orderId;
    res.status(200).json({
            message: "Order details",
            id: id
        });
});

router.delete("/:orderId", (req, res, next) => {
    const id = req.params.orderId;
    res.status(200).json({
            message: "Order deleted",
            id: id
        });
});

module.exports = router;
