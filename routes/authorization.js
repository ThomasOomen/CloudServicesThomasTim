const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const verify = require("../controller/authorization.controller")
const jwt = require("jsonwebtoken");

router.post("/register", async(req, res) => {

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    console.log(hashPassword);

    const user = new User({
        email: req.body.email,
        userName: req.body.userName,
        password: hashPassword
    });

    try {
        const savedUser = await user.save();
        res.status(200).sendData(JSON.stringify({
            status: 'success',
            message: 'user created',
        }));
    } catch(err){
        res.status(400).send(err);
    }
});

router.post("/login", async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if(!user) return res.status(400).send("Email or password is wrong");
        const validPass = await bcrypt.compare(req.body.password, user.password);
        if(!validPass) return res.status(400).send("invalid password.");

        const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
        res.header('auth_token', token).send(token);
        res.send("logged in");
});


router.get("/profile", verify ,(req, res) => {
      res.json({
        message: 'You made it to the secure route',
        user: req.user,
        token: req.query.secret_token
      })
    }
  );

module.exports = router;