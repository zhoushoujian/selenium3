require("./chrome");
describe('launch browser', function () {
  this.timeout(90000);
  before(function () {
    return chrome.init({
        browserName: 'chrome'
      })
      .then(() => chrome.get("http://www.2126057.cn").windowHandle()
        .then((s) => chrome.maximize(s)))
      .then(() => chrome.takeScreenshot((err, screenshot) => chrome.saveScreenshot(require('path').join(__dirname,'../data/2.jpg'), screenshot)))
      .then(() => chrome.noop().sleep(2500));
  })
  after(function () {
    return chrome.quit();
  })
  it("should retrieve the page title", function () {
    const {
      exec
    } = require('child_process');
    return new Promise(function (res, rej) {
        const img1 = '../data/1.jpg';
        const img2 = '../data/2.jpg';
        exec(`python ../call/python_compare_pic.py ${img1} ${img2}`, {
          encoding: 'utf-8',
          shell: true
        }, (error, stdout, stderr) => {
          if (error) throw error
          console.log("stdout", stdout);
          res(stdout);
        })
      })
      .then(function (s) {
        console.log(s)
        return Promise.resolve(s <= 200).should.become(true);
      })
      .then(() => chrome.title().should.become("快捷网址导航-www.2126057.cn"))
      .then(() => chrome.elementByCss('#keyword').click().type("周守俭").sleep(1500).keys("\uE003").sleep(5500));
  });
});