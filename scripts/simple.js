require("../basic/chrome")

describe("launch chrome", function () {
    this.timeout(20000)
    before(function () {
        return chrome.init({
            browserName: 'chrome'
        })
    })
    after(function () {
        return chrome.quit()
    })
    it("open index", function () {
        return chrome.doOpenIndex()
            .then(() => chrome.title().should.become("周守俭的旅游相册空间"))
    })
});
