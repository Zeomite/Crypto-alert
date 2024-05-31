const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const redis = require("redis");
const http = require("http");
const { Server } = require("socket.io");
const User = require("./userModel.js");
const axios = require("axios");
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "varunkhanijo14@gmail.com",
    pass: process.env.NODEMAILER_PASS ,
  },
});

const redisClient = redis.createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_URL,
    port: process.env.REDIS_PORT,
  },
});
redisClient.on("error", (err) => console.log("Redis Client Error", err));

redisClient.connect();

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("subscribe", (email) => {
      socket.join(email);
    });
  
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

app.use(express.json());

app.get("/", (req, res) => {
  res.json("Welcome to the API");
});

app.post("/set-alert", async (req, res) => {
  const { email, password, coin, targetPrice } = req.body;
  let user = await User.findOne({ email });
  if (!user) {
    var mapping = Map()
    mapping.set(coin,targetPrice)
    user = new User({ email: email, password: password, targetPrices: mapping });
  } else {
    user.targetPrice.set(coin,targetPrice);
  }
  await user.save();
  res.send({ message: "Alerts set successfully" });
});

async function fetchPrice(coin) {
  try {
    const response = await axios({
      method: "GET",
      url: `${process.env.COINAPI_URL}/exchangerate/${coin}/USD`,
      headers: { "X-CoinAPI-Key": process.env.COINAPI_KEY },
    });
    const price = response.data.rate;
    await redisClient.set(coin, JSON.stringify(price));
    io.emit(coin, price);
    return price;
  } catch (error) {
    console.error(`Error fetching price for ${coin}:`, error);
    return null;
  }
}

async function fetchAndCachePrices() {
  try {
    const coinsToUpdate = new Set(); // Set to store coins already updated in this function call

    const users = await User.find();
    for (const user of users) {
      for (const [coin, targetPrice] of user.targetPrices.entries()) {
        if (!coinsToUpdate.has(coin)) {
          const price = await fetchPrice(coin);
          if (price <= user.targetPrices.coin) {
            await transporter.sendMail({
              from: '"App Auth" <varunkhanijo14@gmail.com>', // sender address
              to: user.email,
              subject: "ALERT TARGET PRICE REACHED!!", // Subject line
              text: `Price for the ${coin} is ${price}`, // plain text body
            });
          }
        }
      }
    }
  } catch (error) {
    console.error("Error fetching prices:", error);
  }
}



setInterval(fetchAndCachePrices, 6000);

server.listen(3178, () => {
  console.log(`Server running on port 3178`, (err) =>
    console.log("Web Socket Error", err)
  );
});

const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(port, () => {
      console.log(`Database running on ${port}, http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
