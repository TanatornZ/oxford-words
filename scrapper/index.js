const HTMLParser = require("node-html-parser");

const fs = require("fs");
const path = require("path");

fs.readFile(path.join(__dirname, "data.txt"), (err, data) => {
  if (err) throw err;

  const root = HTMLParser.parse(data.toString());

  let result = [];
  root.querySelectorAll("li").forEach((data) => {
    const ox5000 = !!data.getAttribute("data-ox5000");
    const ox3000 = !!data.getAttribute("data-ox3000");

    if (ox5000 || ox3000) {
      const word = data.querySelector("a").text;
      const type = data.querySelector("span").text;
      const level = data.querySelector("div span").text;

      result.push({ word, type, level, ox3000, ox5000 });
    }
  });

  fs.writeFile(
    path.join(__dirname, "words.json"),
    JSON.stringify(result),
    function (err) {
      if (err) throw err;
      console.log("Saved!");
    }
  );
});
