require("dotenv").config();
const fs = require("fs");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const Handlebars = require("handlebars");
const nodemailer = require("nodemailer");

const getHTML = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    "https://www.wanted.co.kr/wdlist/518?country=kr&job_sort=company.response_rate_order&years=0&locations=seoul.all&locations=gyeonggi.seongnam-si"
  );
  const content = await page.content();
  await browser.close();
  return content;
};

const parseHTML = (html) => {
  const $ = cheerio.load(html);
  const jobs = [];
  const lists = $("div.List_List_container__JnQMS > ul").children();
  lists.each((index, list) => {
    const position = $(list).find("div > a > div > div.job-card-position").text().trim();
    const company = $(list).find("div > a > div > div.job-card-company-name").text().trim();
    const link = "https://www.wanted.co.kr" + $(list).find("div > a").attr("href");
    jobs.push({ position, company, link });
    console.log({ position, company, link });
  });
  return jobs;
};

// const main = async () => {
//   const html = await getHTML();
//   const jobs = parseHTML(html);
//   const outputHTML = generateHTML(jobs);
//   fs.writeFileSync("wanted.html", outputHTML, (err) => {
//     if (err) throw err;
//     console.log("File written to wanted.html");
//   });
// };

// main();
const renderTemplate = (data) => {
  const source = fs.readFileSync("jobs-template.hbs", "utf8");
  const template = Handlebars.compile(source);
  return template({ jobs: data });
};

const sendEmail = async (html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_ID,
      pass: process.env.GMAIL_PW,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_ID,
    to: process.env.GMAIL_ID,
    subject: "New Job Listings",
    html: html,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

const run = async () => {
  const jobs = await parseHTML(await getHTML("0"));
  const html = renderTemplate(jobs);
  //   sendEmail(html);
  console.log(html);
};

run();
