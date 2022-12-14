const mongoose = require("mongoose");

const orderShema = mongoose.Schema({
  name_surname: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  dimensions: {
    type: String,
    require: true,
  },
  color: {
    type: String,
    require: true,
  },
  completed: {
    type: Boolean,
    require: true,
    default: false,
  },
  portfolio: {
    type: Array,
    require: true,
    default: [],
  },
});

const Order = mongoose.model("order", orderShema);

module.exports = Order;
