import request from "request";
import cheerio from "cheerio";
let url = "https://torrenthaja.com/bbs/board.php?bo_table=torrent_drama&page=1";
console.log("Drama Crawler is running!");
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
      console.log({
        ...item,
        magnet: $(".glyphicon-magnet")
          .parent()
          .attr("onclick")
      });
    });
  });
});
