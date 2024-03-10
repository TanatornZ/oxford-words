const axios = require("axios");
const HTMLParser = require("node-html-parser");

const getTranslate = async (word) => {
  const res = await axios.get(
    `https://dict.longdo.com/mobile.php?search=${word}`
  );

  const root = HTMLParser.parse(res.data);

  const table = root.querySelector("table");

  const translate = [];
  table?.querySelectorAll("tr").forEach((td) => {
    const eng = td.querySelector("td:nth-child(1)")?.text || "-";
    const thai = td.querySelector("td:nth-child(2)")?.firstChild?.text || "-";

    translate.push({
      eng,
      thai,
    });
  });

  return translate;
};

module.exports = { getTranslate };
