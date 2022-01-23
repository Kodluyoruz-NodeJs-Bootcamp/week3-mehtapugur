import express from "express";
import { loginUser, createUser } from "../controllers/authController";

const router = express.Router();

//Routes
router.get("/login", (req, res, next) => {
  res.render("login");
});

router.get("/", (req, res, next) => {
  res.render("index");
});

//reset cookie
router.get(
  "/logout",
  (req, res, next) => {
    res.cookie("jwt", "", { maxAge: 1 });
    res.cookie("connect.sid", "", { maxAge: 1 });
    next();
  },
  (req, res, next) => {
    res.redirect("/");
  }
);

//Login and Create
router.post("/login", loginUser);
router.post("/signup", createUser);

const authRoute = router;
export default authRoute;
