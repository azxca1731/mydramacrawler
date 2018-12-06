import { Router } from "express";
import request from "request-promise";
import cheerio from "cheerio";
import VideoInfo from "./models/video_info";
const router = Router();

const dramaParser = dramaString => {
  let others = dramaString;
  const title = others.substr(0, others.indexOf("."));
  others = others.substr(title.length + ".E".length, dramaString.length);
  const episode = others.substr(0, others.indexOf("."));
  others = others.substr(episode.length + ".".length, dramaString.length);
  const broadcastdate = others.substr(0, others.indexOf("."));
  others = others.substr(broadcastdate.length + ".".length, dramaString.length);
  const quality = others.substr(0, others.indexOf("p"));
  return { title, episode, broadcastdate, quality };
};

router.get("/example", async (req, res) => {
  console.log(dramaParser("비밀과 거짓말.E98.181206.720p-NEXT"));
});
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
  let recentVideoInfo = await VideoInfo.find()
    .sort({ index: -1 })
    .limit(1);
  if (recentVideoInfo.length === 0) recentVideoInfo = [{ index: 0 }];
  console.log(recentVideoInfo[0].index);
  let body = await request(options);
  const $ = cheerio.load(body);

  $(".td-subject").map((_, item) => {
    let number = $(item)
      .parent()
      .prev()
      .text()
      .substr(1);
    number =
      number.substr(0, number.indexOf(",")) +
      number.substr(number.indexOf(",") + 1, number.length);
    dramaArray.push({
      index: number,
      href: item.children[1].attribs.href,
      crawledtitle: $(item)
        .children()
        .text()
    });
  });
  const promiseArray = dramaArray
    .filter(item => item.index > recentVideoInfo[0].index)
    .map(async item => {
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
  json = json.map(async ({ index, crawledtitle, magnet }) => {
    const item = new VideoInfo();
    item.index = index;
    const origTitle = crawledtitle.substr(2, crawledtitle.length);
    const { title, episode, broadcastdate, quality } = dramaParser(origTitle);
    item.title = title;
    item.episode = episode;
    item.broadcastdate = broadcastdate;
    item.quality = quality;
    item.magnet = magnet.substr(
      "magnet_link('".length,
      magnet.length - 3 - "magnet_link('".length
    );
    await item.save();
  });
  try {
    json = await Promise.all(json);
  } catch (err) {
    console.log(err);
  }
  res.json(json);
});

export default router;
