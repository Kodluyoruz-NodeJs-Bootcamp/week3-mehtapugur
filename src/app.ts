import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import MongoStore from "connect-mongo";
import path from "path";
import authRoute from "./routes/authRoute";
import { auth, userControl } from "./middlewares/authMiddleware";
import { getHomePage } from "./controllers/authController";

const app = express();
require("dotenv").config();

// view engine
app.set("view engine", "ejs");

//give error
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION, APP SHUTTING NOW!!");
  console.log(err.message, err.name);
  process.exit(1);
});

//Connect DB
mongoose
  .connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
  })
  .then(() => {
    console.log("Database Connected Successfully..");
  });

// middleware
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 600000,
      httpOnly: true,
    },
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.DATABASE_URI,
    }),
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//check user
app.use(userControl);

//main page
app.get("/", (req, res, next) => {
  res.render("index");
});
app.get("/home", auth, getHomePage);
app.use(authRoute);

const PORT = process.env.PORT;
const HOST = process.env.HOST;

app.listen(PORT, HOST, () => {
  console.log(`Server is listening ${HOST}:${PORT}`);
});
