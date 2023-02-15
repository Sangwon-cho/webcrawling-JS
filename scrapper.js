const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
(async () => {
  // headless 브라우저 실행
  const browser = await puppeteer.launch();
  // 새로운 페이지 열기
  const page = await browser.newPage();
  // `https://ko.reactjs.org/` URL에 접속
  await page.setViewport({
    width: 1366,
    height: 768,
  });
  await page.goto(
    "https://www.wanted.co.kr/wdlist/518?country=kr&job_sort=company.response_rate_order&years=0&locations=seoul.all&locations=gyeonggi.seongnam-si"
  );
  const content = await page.content();
  const $ = cheerio.load(content);
  const lists = $("div.List_List_container__JnQMS > ul").children();
  //   #__next > div.JobList_cn__t_THp > div > div > div.List_List_container__JnQMS > ul > li:nth-child(1)
  lists.each((index, list) => {
    const postion = $(list).find("div > a > div > div.job-card-position").text();
    const company = $(list).find("div > a > div > div.job-card-company-name").text();
    const link = $(list).find("div > a").attr("href");
    console.log({ postion, company, link });
  });

  //   const result = await page.evaluate(() => {});

  /****************
   * 원하는 작업 수행 *
   ****************/

  // 모든 스크래핑 작업을 마치고 브라우저 닫기
  await browser.close();
})();
