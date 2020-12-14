require("./chrome");
const { exec } = require('child_process');
const path = require('path')

describe('launch browser', function () {
    this.timeout(90000);
    before(function () {
        return chrome.init({
            browserName: 'chrome'
        })
            .then(() => chrome.get("http://dh.zhoushoujian.com").windowHandle()
                .then((s) => chrome.maximize(s)))
            .then(() => chrome.takeScreenshot((err, screenshot) => chrome.saveScreenshot(path.join(__dirname, '../data/2.jpg'), screenshot)))
            .then(() => chrome.noop().sleep(2500));
    })
    after(function () {
        return chrome.quit();
    })
    it("should retrieve the page title", function () {
        return new Promise(function (res) {
            const img1 = path.join(__dirname, '../data/1.jpg')
            const img2 = path.join(__dirname, '../data/2.jpg')
            const pyFile = path.join(__dirname, '../call/python_compare_pic.py')
            exec(`python ${pyFile} ${img1} ${img2}`, {
                encoding: 'utf-8',
                shell: true
            }, (error, stdout) => {
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
