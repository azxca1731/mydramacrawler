import express from "express";
import api from "./apiroutes";
let port = process.env.PORT || 80;
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello It is Crawler");
});

app.use("/api", api);

app.listen(port, () => {
  console.log("Drama Crawler is running!");
});
