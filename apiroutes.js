import { Router } from "express";
import request from "request-promise";
import cheerio from "cheerio";
const router = Router();

router.get("/", async (req, res) => {
  const page = req.query.page || 1;
  const options = {
    uri: "https://torrenthaja.com/bbs/board.php",
    qs: {
      bo_table: "torrent_drama",
      page
    }
  };
  const dramaArray = [];
  let body = await request(options);
  const $ = cheerio.load(body);

  $(".td-subject").map((_, item) => {
    dramaArray.push({
      index: $(item)
        .parent()
        .prev()
        .text(),
      href: item.children[1].attribs.href,
      title: $(item)
        .children()
        .text()
    });
  });
  const promiseArray = dramaArray.map(async item => {
    body = await request(item.href);
    const $ = cheerio.load(body);
    return {
      ...item,
      magnet: $(".glyphicon-magnet")
        .parent()
        .attr("onclick")
    };
  });
  let json = await Promise.all(promiseArray);
  json = json.map(({ index, title, magnet }) => {
    return {
      index: index.substr(1, index.length),
      title: title.substr(2, title.length),
      magnet: magnet.substr(
        "magnet_link('".length,
        magnet.length - 3 - "magnet_link('".length
      )
    };
  });
  res.json(json);
});

export default router;
