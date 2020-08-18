const express = require("express");
const createError = require("http-errors");
const logger = require("morgan");
const mongoose = require("mongoose");

const productsRouter = require("./api/routes/products");
const ordersRouter = require("./api/routes/orders");

mongoose.connect(`mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@${process.env.SERVER}/${process.env.DATABASE}?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

const app = express();

app.use(logger("dev"));
app.use("/images", express.static("images"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

app.use("/products", productsRouter);
app.use("/orders", ordersRouter);

app.use((req, res, next) => {
    // const error = new Error("Not found");
    // error.status = 404;
    // next(error);
    next(createError(404));
});

app.use((err, req, res, next) => {
    console.error(err);
    // console.error(err.stack);
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    });
});

module.exports = app;
