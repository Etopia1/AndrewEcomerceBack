// const express = require("express");
// require("./config/dbConfig");
// require(`dotenv`).config()
// const port = process.env.PORT || 1188;
// const cors = require("cors");
// const morgan = require("morgan");
// const bodyParser = require("body-parser")
// const userRouter = require("./routers/userRouter");
// const productRouter = require("./routers/productRouter");
// // const merchantRouter = require("./routers/merchantRouter");
// const NewmarCh = require("./routers/NewmarCh");
// const fileUploader = require("express-fileupload");
// const orderRoute = require("./routers/orderRoute")
// const cartRouter = require("./routers/cartRouter");
// const categoryRoute = require("./routers/categoryRoutes")
// // const keepServerAlive = require(`./helpers/keepServerAlive`)

// const app = express();
// app.use(express.json());
// app.use(bodyParser.json({ limit: "50mb" }));
// app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
// app.use(fileUploader({
//   useTempFiles: true,
//   tempFileDir: '/tmp/',  // Temporary directory for storing files
//   limits: { fileSize: 50 * 1024 * 1024 }  // Set file size limit if needed (5MB example)
// }))
// app.use(cors({ origin: "*", credentials: true}));
// app.use(morgan("dev"));

// app.use("/api/v1", userRouter);
// // app.use("/api/v1", merchantRouter);
// app.use("/api/v1", NewmarCh);
// app.use("/api/v1", productRouter);
// app.use("/api/v1", categoryRoute )
// app.use("/api/v1", cartRouter);
// app.use("/api/v1", orderRoute)

// // keepServerAlive();


// app.get('/1', (req, res) => {
//    res.send('Server is alive!');
// });

// app.get("/", (req, res) => {
//   res.send("Welcome to Groceria Stores!");
// });


// app.listen(port, () => {
//   console.log("App is currently Up & Running, server is listening to port:", port);
// });




// // require('dotenv').config();
// // const express = require('express');
// // const mongoose = require('mongoose');
// // const passport = require('passport');
// // // const session = require('express-session');
// // require('./config/passport');
// // const cors = require("cors");

// // const authRoutes = require('./routers/auth');

// // const app = express();

// // // Middleware
// // app.use(express.json());
// // // app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
// // app.use(passport.initialize());
// // app.use(passport.session());
// // app.use(cors({ origin: "*", credentials: true}));

// // // MongoDB Connection
// // mongoose
// //   .connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
// //   .then(() => console.log('MongoDB connected'))
// //   .catch((err) => console.error(err));

// // // Routes
// // app.use('/auth', authRoutes);

// // // Start Server
// // const PORT = process.env.PORT || 3000;
// // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


const express = require("express");
require("./config/dbConfig");
require("dotenv").config();
const port = process.env.PORT || 1188;
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");

const userRouter = require("./routers/userRouter");
const productRouter = require("./routers/productRouter");
const NewmarCh = require("./routers/NewmarCh");
const fileUploader = require("express-fileupload");
const orderRoute = require("./routers/orderRoute");
const cartRouter = require("./routers/cartRouter");
const categoryRoute = require("./routers/categoryRoutes");
const authRouter = require("./routers/authRouter"); // 👈 new
const wishlistRouter = require("./routers/wishlistRouter");

const app = express();

app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(fileUploader({
  useTempFiles: true,
  tempFileDir: "/tmp/",
  limits: { fileSize: 50 * 1024 * 1024 },
}));

app.use(cors({ origin: "*", credentials: true }));
app.use(morgan("dev"));

// 🔐 Session + Passport Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/v1", userRouter);
app.use("/api/v1", NewmarCh);
app.use("/api/v1", productRouter);
app.use("/api/v1", categoryRoute);
app.use("/api/v1", cartRouter);
app.use("/api/v1", orderRoute);

app.use("/api/v1", authRouter);
app.use("/api/v1", wishlistRouter);

app.get("/", (req, res) => {
  res.send("Welcome to Groceria Stores!");
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
