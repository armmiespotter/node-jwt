require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();

const data = [
  {
    username: "sherlockholmes",
    fullname: "William Sherlock Scott Holmes",
  },
  {
    username: "johnwatson",
    fullname: "John H. Watson",
  },
  {
    username: "lestrade",
    fullname: "G. Lestrade",
  },
];

app.use(express.json());

app.get("/user", (req, res) => {
  const username = req.body.username;
  const user = { username: username };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.send({ accessToken: accessToken });
});

app.get("/profile", authToken, (req, res) => {
  res.json(data.filter((user) => user.username == req.body.username));
});

function authToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, rows) => {
    if (err) return res.sendStatus(403);
    res.user = rows;
  });
  next();
}

app.listen(process.env.PORT, () => {
  console.log(
    `Server is listening on port ${process.env.PORT} | http://localhost:${process.env.PORT}`
  );
});
