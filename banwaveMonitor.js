const axios = require("axios");
const cheerio = require("cheerio");

async function getTodayBans() {
    const { data } = await axios.get("https://battleye.dudx.info");

    const $ = cheerio.load(data);

    return Number(
        $(".text-4xl.font-bold.text-primary")
            .eq(1)
            .text()
            .trim()
    );
}

module.exports = { getTodayBans };