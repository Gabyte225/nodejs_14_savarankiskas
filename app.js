const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

//Middlewere
app.use(express.json());
app.use(cors());

//Connection to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to Mongo DB");

    app.listen(PORT, () => console.log("Server running on port:" + PORT));
  })
  .catch((e) => console.log(e));

const Order = require("./models/order.model.js");

//Routes
// -- POST /api/orders  | creates new order

app.post("/api/orders", async (req, res) => {
  const newOrderData = req.body;
  try {
    const newOrder = new Order(newOrderData);
    const createdOrder = await newOrder.save();
    console.log({ order: createdOrder });
    res.json({ message: "Order created", order: createdOrder });
  } catch (error) {
    console.log(error);
  }
});

//-- GET /api/orders          | Get all orders

app.get("/api/orders", async (req, res) => {
  const newOrdersData = req.params;
  try {
    const allOrders = await Order.find(newOrdersData);
    res.json(allOrders);
  } catch (error) {
    console.log(error);
  }
});

//-- PUT /api/orders/:id      | update status and portfolio info

app.put("/api/orders/:id", async (req, res) => {
  const orderId = req.params.id;
  const order = { ...req.body };
  try {
    const admin = await Order.findById(orderId);
    const currentOrder = admin.portfolio;
    
    const updatePortfolio = await Order.findByIdAndUpdate(orderId, {
      completed: true,
      portfolio: [...currentOrder, order],
    });

    res.json({ message: "Order completed", updatePortfolio });
  } catch (error) {
    console.log(error);
  }
});

//-- GET /api/portfolio          | Get all done orders

app.get("/api/portfolio", async (req, res) => {
  try {
    const portfolios = await Order.find();
    const doneOrders = portfolios.reduce((total, items) => {
      items.portfolio.forEach((portfolio) => {
        if ((completed = true)) {
          total.push(portfolio);
        }
      });
      return total;
    }, []);
    res.json(doneOrders);
  } catch (error) {
    console.log(error);
  }
});
