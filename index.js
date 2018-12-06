import express from "express";
import { connection, connect } from "mongoose";

const PORT = process.env.PORT || 80;
const db_url = process.env.DBURL;
connection.on("error", console.error);
connection.once("open", function() {
  console.log("Connected to mongod server");
});
connect(db_url);
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
