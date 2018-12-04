import request from "request";
import cheerio from "cheerio";
import express from "express";

let port = process.env.PORT || 80;
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello It is Crawler");
});

app.get("/api", async (req, res) => {
  let url =
    "https://torrenthaja.com/bbs/board.php?bo_table=torrent_drama&page=1";

  request(url, function(error, response, body) {
    const $ = cheerio.load(body);
    let dramaArray = [];
    $(".td-subject").map((_, item) => {
      dramaArray.push({
        href: item.children[1].attribs.href,
        title: $(item)
          .children()
          .text()
      });
    });
    let toBeSavedArray = [];
    dramaArray.map(item => {
      request(item.href, (err, res, body) => {
        const $ = cheerio.load(body);
        toBeSavedArray.push({
          ...item,
          magnet: $(".glyphicon-magnet")
            .parent()
            .attr("onclick")
        });
      });
    });
    res.json(toBeSavedArray);
  });
});

app.listen(port, () => {
  console.log("Drama Crawler is running!");
});
