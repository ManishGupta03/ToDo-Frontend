const express = require("express");
const User = require("../Models/userModel");
const { validateRegisterData, userNameAndEmailExist, findUserWithLoginId} = require("../Utils/authUtils");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const {generateToken} = require("../JWT/token");
const { isAuth } = require("../Middlewares/IsAuth");




const AuthRouter = express.Router();
//auth/register
AuthRouter.post("/register", async (req, res) => {
    const { name, email, username, password } = req.body;

        //clean the data
        try {
            await validateRegisterData({ name, email, username, password });
          } catch (error) {
            return res.send({
              status: 400,
              message: "Data error",
              error: error,
            });
          }


    //check if email and username already exist

    try{
        await userNameAndEmailExist({ email, username });
        const user = new User({ name, email, username, password });
        await user.save();
        // res.status(201).json({ userId: user._id, message: 'User created successfully' });
        const token=generateToken(user);
      return res.send({
        status: 201,
        message: "Register successfull",
        data: token
         });
    }
    catch (error) {
        return res.send({
          status: 500,
          message: "Database error",
          error: error,
        });
      }
});
//auth/logiin
AuthRouter.post("/login", async (req, res) => {
    const { loginId, password } = req.body;
  
    if (!loginId || !password)
      return res.send({
        status: 400,
        message: "Missing credentials",
      });

      //find the user from db
    try {
        const userDb = await findUserWithLoginId({ loginId });
    
        //compare the password
        const isMatched = await bcrypt.compare(password, userDb.password);
        if (!isMatched) {
          return res.send({
            status: 400,
            message: "Password doest not matched",  
          });
        }
        req.session.isAuth = true;  
        const token=generateToken(userDb);
        req.session.user = {
            userId: userDb._id, //BSON  userDb._id.toString()
            email: userDb.email,
            username: userDb.username,
          };
        return res.send({
            status: 200,
            message: "Login successfull",
            data:token
          });
        } catch (error) {
          return res.send({
            status: 500,
            message: "Database error",
            error: error,
          });
        }
})

//auth/logout
AuthRouter.post("/logout",isAuth, async (req, res) => {
    req.session.destroy((err) => {
      if (err) return res.send({ status: 400, message: "Logout unsuccessfull" });
      return res.send({ status: 200, message: "Logout successfull" });
    });
  });

module.exports = AuthRouter;