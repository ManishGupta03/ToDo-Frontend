const express = require("express");
const clc = require("cli-color");
require("dotenv").config();
const session = require("express-session");
const mongoDbSession = require("connect-mongodb-session")(session);
const todoDb = require("./Database/todoDb");
const AuthRouter = require("./Controller/AuthController");
const cors = require('cors');
const router = require("./Controller/ActivityController");

const app = express();

todoDb();


const PORT = process.env.PORT || 8000;
app.use(express.json());
app.use(cors());

const store = new mongoDbSession({
    uri: process.env.MONGO_URI,
    collection: "sessions",
  });


  app.use(
    session({
      secret: process.env.SECRET_KEY,
      resave: false,
      saveUninitialized: false,
      store: store,
    })
  );

app.get("/", (req, res) => {
  return res.send({
    status: 200,
    message: "Server is up an run condition. ",
  });
});


app.use("/auth", AuthRouter);
app.use("/activity", router);



app.listen(PORT,()=>{console.log(clc.yellowBright(`Server is running on PORT:${PORT}`));});