import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { RequestHandler } from "express";

const createToken = (id: string, browserInfo: string): string =>
  jwt.sign({ id, browserInfo }, process.env.JWT_SECRET, {
    expiresIn: "60m", //minutes, session time
  });

export const createUser: RequestHandler = async (req, res) => {
  const { name, surname, email, username, password } = req.body;
  const browserInfo = req.headers["user-agent"];

  try {
    //create new user
    const user = await User.create({
      name,
      surname,
      email,
      username,
      password: await bcrypt.hash(password, 8),
    });

    //create token
    const token = createToken(user._id, browserInfo);

    res.cookie("jwt", token, { httpOnly: true, maxAge: 600000 });
    //res.status(201).json({ user: user._id }); //?
    if (user) res.status(201).redirect("/login");
  } catch (err) {
    res.status(400).json({ errors: err });
  }
};

export const loginUser: RequestHandler = async (req, res) => {
  //take user information from form
  const { username, password } = req.body;
  const browserInfo = req.headers["user-agent"];

  try {
    //find user in database
    const user = await User.findOne({ username });

    //decrypt encrypted password and compare with entered password
    bcrypt.compare(password, user.password, (err, same) => {
      if (same) {
        //create a token with JWT
        const token = createToken(user._id, browserInfo);

        //send this token to cookie
        res.cookie("jwt", token, { httpOnly: true, maxAge: 600000 });
        //res.status(200).json({ user: user._id }); //?
        res.status(200).redirect("/users/home");
      } else {
        res.redirect(301, "login");
      }
    });
  } catch (err) {
    res.status(400).json({ errors: err });
    res.redirect("/");
  }
};

//get home page where users are listed
export const getHomePage: RequestHandler = async (req, res) => {
  const users = await User.find();
  res.status(200).render("home", {
    users,
  });
};
