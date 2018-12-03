import request from "request";

let url = "https://torrenthaja.com/bbs/board.php?bo_table=torrent_drama&page=1";
console.log("Drama Crawler is running!");
request(url, function(error, response, body) {
  console.log(body);
});
