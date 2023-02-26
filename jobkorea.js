const axios = require("axios");
const cheerio = require("cheerio");

const getHTML = async (keyword) => {
  try {
    const html = (await axios.get(`https://www.jobkorea.co.kr/Search/?stext=${encodeURI(keyword)}`))
      .data;

    return html;
  } catch (e) {
    console.log(e);
  }
};

const parsing = async (page) => {
  const $ = cheerio.load(page);
  const jobs = [];
  const $jobList = $(".post");
  $jobList.each((idx, node) => {
    const title = $(node).find(".title:eq(0)").text().trim();
    const company = $(node).find(".name:eq(0)").text().trim();
    const experience = $(node).find(".exp:eq(0)").text().trim();

    jobs.push({ title, company, experience });
  });
  return jobs;
};

const getJob = async (keyword) => {
  const html = await getHTML(keyword);
  const jobs = await parsing(html);
  console.log(jobs);
};

getJob("node.js");
