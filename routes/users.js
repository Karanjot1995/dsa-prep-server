const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load the .env file
const requireAuth = require("../middlewares/requireAuth");
const Question = require("../models/question");

router.post("/sign-up", async (req, res) => {
  try {
    //Extracting email and password from the req.body object
    const { email, password } = req.body;

    //Checking if email is already in use
    let userExists = await User.findOne({ email });
    if (userExists) {
      res.status(401).json({ message: "Email is already in use." });
      return;
    }

    //salting
    const saltRounds = 10;

    //Hashing a Password
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        throw new Error("Internal Server Error");
      }

      //Creating a new user
      let user = new User({
        email,
        password: hash,
      });

      //Saving user to database
      user.save().then(() => {
        return res.json({ message: "User created successfully", user });
      });
    });
  } catch (error) {
    res.status(401).send(error.message);
  }
});

router.post("/sign-in", async (req, res) => {
  try {
    //Extracting email and password from the req.body object
    const { email, password } = req.body;
    const JWT_SECRET = process.env.JWT_SECRET;

    //Checking if user exists in database
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email Credentials" });
    }

    //Comparing provided password with password retrived from database
    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        const token = jwt.sign({ email, _id:user._id }, JWT_SECRET);
        let u = {email, id:user._id}
        return res
          .status(200)
          .json({ message: "User Logged in Sucessfully", token, user:u });
      }

      console.log(err);
      return res.status(401).json({ message: "Invalid Credentials" });
    });
  } catch (error) {
    res.status(401).send(error.message);
  }
});

router.get("/all", async (req, res) => {
  try {
    // let data = []
    let users = await User.find({}).select("-password").then();
    
    let data = users.map(async u=>{
      u = u.toObject()
      u['questions'] = []
      await Question.find({uid:u._id}).then(res=>{
        if(res){
          u.questions = res
        }
      })
      return u
    })

    res.status(200).json(await Promise.all(data))
    
  } catch (error) {
    res.status(401).send(error.message);
  }
});

router.get("/test", requireAuth, (req, res) => {
  res.send(`User: ${req.user.email} is authorized to make this request`);
});


module.exports = router;
