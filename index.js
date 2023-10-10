const dotenv = require("dotenv");
const mysql = require("mysql");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const app = express();

app.use(express.json());

dotenv.config({
  path: "./data/config.env",
});

const connection = mysql.createConnection({
  host: "db4free.net",
  port: 3306,
  user: "shiva_kumar",
  password: "sai@1234",
  database: "user_details_db",
});

connection.connect(function (error) {
  if (error) throw error;
  console.log("connect database successfuly..");
});

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://online-shoping-app.netlify.app",
      "https://jobby-web-application.netlify.app/",
    ],
    methods: ["POST", "DELETE", "PUT", "GET"],
  })
);

app.post("/register", async (request, response) => {
  const { username, password, name, gander } = request.body;
  const modifyPassword = await bcrypt.hash(password, 10);
  connection.query(
    `select * from user where user_name = '${username}'`,
    (error, reslut) => {
      if (error) {
        response.status(400).json({ error_msg: "database error" });
      } else {
        if (reslut.length === 0) {
          connection.query(
            `insert into user(name , user_name , password , gander)values('${name}','${username}' ,  '${modifyPassword}' , '${gander}')`,
            (error, reslut) => {
              if (error) {
                response.status(400).json({ error_msg: "database error" });
              } else {
                response.status(200).json({ masg: "successfuly login" });
              }
            }
          );
        } else {
          response
            .status(400)
            .json({ error_msg: "this username already register" });
        }
      }
    }
  );
});

app.post("/login", (request, response) => {
  const { username, password } = request.body;
  connection.query(
    `select * from user where user_name = '${username}'`,
    async (error, reslut) => {
      if (error) {
        response.status(400).json({ error_msg: "database error" });
      } else {
        if (reslut.length !== 0) {
          const comperePassword = await bcrypt.compare(
            password,
            reslut[0].password
          );
          if (comperePassword) {
            response.status(200).json({ masg: "successfuly login" });
          } else {
            response.status(400).json({ error_msg: "password is wrong" });
          }
        } else {
          response.status(400).json({ error_msg: "user is not register" });
        }
      }
    }
  );
});

app.listen(process.env.PORT, () =>
  console.log(`server is running ${process.env.port}`)
);
