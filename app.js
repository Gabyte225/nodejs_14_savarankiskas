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
// -- POST /api/users/signup  | User signup (creates new user)

app.post("/api/orders", async (req, res) => {
  const newOrderData = req.body;
  try {
    const newOrder = new Order(newOrderData);
    const createdOrder = await newOrder.save();

    res.json({ message: "Order created", order: createdOrder });
  } catch (error) {
    console.log(error);
  }
});

//-- POST /api/users/login    | User login (connects existing user)

app.post("/api/users/login", async (req, res) => {
  const userData = req.body;
  try {
    const user = await User.findOne(userData);
    if (user) {
      res.json({ message: "User found", user });
    } else {
      res.json({ message: "User with given email and password not found" });
    }
  } catch (error) {
    console.log(error);
  }
});

//-- POST /api/movies         | Movie creation (creates new movie)

app.post("/api/movies", async (req, res) => {
  const movieData = req.body;
  const { userId } = movieData;
  try {
    const user = await User.findById(userId);
    const currentMovies = user.movies;

    await User.findByIdAndUpdate(userId, {
      movies: [...currentMovies, movieData],
    });

    const uppdatedUser = await User.findById(userId);

    res.json({ message: "Movie added", user: uppdatedUser });
  } catch (error) {
    console.log(error);
  }
});

//-- GET /api/movies          | Movie listing (retrieving all movies)

app.get("/api/movies", async (req, res) => {
  try {
    const users = await User.find();
    const availableMovies = users.reduce((total, item) => {
      item.movies.forEach((movie) => {
        if (movie.is_available) {
          total.push(movie);
        }
      });

      return total;
    }, []);
    console.log(availableMovies);
  } catch (error) {
    console.log(error);
  }
});

//-- GET /api/user/:id        | User information (retrieving user information and his movies and orders)

app.get("/api/user/:id ", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    res.json(user);
  } catch (error) {
    console.log(error);
  }
});

//-- PUT /api/movies/:id      | Movie update and order creation

app.put("/api/movies/:id", async (req, res) => {
  const userId = req.params.id; // whitch rents a movie
  const order = {
    ...req.body,
    return_days: 30,
  };
  try {
    //updating user whitch rents a movie order status
    const tenant = await User.findById(userId);
    const currentOrders = tenant.orders;

    await User.findByIdAndUpdate(userId, {
      orders: [...currentOrders, order],
    });

    //updating user who's movie is rented movie status
    const movieOwner = await User.findById(order.movieOwnerId);
    const updatedOwnerMovies = movieOwner.movies.map((movie) => {
      if (movie.movie_name === order.movie_name) {
        movie.is_available = false;
      }
      return movie;
    });

    await User.findByIdAndUpdate(order.movieOwnerId, {
      movies: updatedOwnerMovies,
    });
    res.json({ message: "Movie rented" });
  } catch (error) {
    console.log(error);
  }
});
