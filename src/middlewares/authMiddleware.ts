import { RequestHandler } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";

export const auth: RequestHandler = (req, res, next) => {
  //get token from cookie
  const token = req.cookies.token;
  req.session.browserInfo = req.headers["user-agent"]; //browser information

  //verify token
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return next();
      //compare browser information
      if (decoded.browserInfo === req.headers["user-agent"]) {
        console.log(decoded);
        console.log(req.session);
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

//check current user
export const userControl: RequestHandler = (req, res, next) => {
  //create token from cookie
  const token = req.cookies.token;

  if (token) {
    //JWT verify
    jwt.verify(token, process.env.JWT_SECRET, async () => {
      next();
    });
  } else {
    next();
  }
};
