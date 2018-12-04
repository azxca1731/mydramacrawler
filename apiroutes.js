import { Router } from "express";
import request from "request-promise";
import cheerio from "cheerio";
const router = Router();

router.get("/", async (req, res) => {
  const options = {
    uri: "https://torrenthaja.com/bbs/board.php",
    qs: {
      bo_table: "torrent_drama",
      page: 1
    }
  };
  const dramaArray = [];
  let body = await request(options);
  const $ = cheerio.load(body);

  $(".td-subject").map((_, item) => {
    dramaArray.push({
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
  const json = await Promise.all(promiseArray);
  res.json(json);
});

export default router;
