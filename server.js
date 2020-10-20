require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const database = require("./database");

// const data = [
//   {
//     username: "sherlockholmes",
//     fullname: "William Sherlock Scott Holmes",
//   },
//   {
//     username: "johnwatson",
//     fullname: "John H. Watson",
//   },
//   {
//     username: "lestrade",
//     fullname: "G. Lestrade",
//   },
// ];

app.use(express.json());

// app.get("/user", (req, res) => {
//   const username = req.body.username;
//   const user = { username: username };
//   const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
//   res.send({ accessToken: accessToken });
// });

// app.get("/profile", authToken, (req, res) => {
//   res.json(data.filter((user) => user.username == req.body.username));
// });

app.post("/login", (req, res) => {
  database.query(
    "SELECT * FROM users WHERE username=? AND password=?",
    [req.body.username, req.body.password],
    (err, rows) => {
      if (rows.length >= 1) {
        const user = JSON.stringify(rows[0]);
        console.log(typeof rows);
        console.log(typeof user);
        // const user = JSON.stringify(rows);
        const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
        res.send(token);
      } else {
        res.send("failed");
      }
    }
  );
});
app.get("/profile", authToken, (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  // var data = JSON.parse(decoded);
  res.send(decoded.email);
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
