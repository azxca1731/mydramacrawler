import express from "express";
import { MongoClient } from "mongodb";
import api from "./apiroutes";

const PORT = process.env.PORT || 80;
const db_url = process.env.DBURL;
MongoClient.connect(db_url)
  .then(() => console.log("Connet with MLab\nMongo is running"))
  .catch(err => console.log(err));
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  //TODO: 인덱스 페이지에 API 사용법 적기
  res.send("Hello It is Crawler");
});

app.use("/api", api);

app.listen(PORT, () => {
  console.log("Drama Crawler is running!");
});
