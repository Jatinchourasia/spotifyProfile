const express = require("express");
const querystring = require("querystring");
const app = express();
require("dotenv").config();
const port = 8080;

const CLIENT_ID = process.env.ClIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URL = process.env.REDIRECT_URL;

console.log(process.env.CLIENT_SECRET);
app.get("/", (req, res) => {
  const data = { name: "jayin" };

  res.json(data);
});

const generateRandomString = (length) => {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

app.get("/login", (req, res) => {
  const queryParam = querystring.stringify({
    client_id: ClIENT_ID,
    response_type: "code",
    redirect_url: REDIRECT_URL,
  });
  res.redirect(`https://accounts.spotify.com/authorize?${queryParam}`);
});

app.listen(port, () => {
  console.log(`app running at http://localhost:${port}/ `);
});
