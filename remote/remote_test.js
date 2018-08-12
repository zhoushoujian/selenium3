require("../basic/chrome");
var remote = require('./remote');
describe("launch chrome",function(){
    this.timeout(60000)
    it("launch chrome",function(){
        return remote(0,function(){
            return chrome.init({
                browserName: 'chrome'
              }).then(() => chrome.doOpenIndex()
              .then(() => chrome.title().should.become("快捷网址导航-dh.zhoushoujian.com"))
            .then(() => chrome.quit()))

        })/* .then(() => chrome.init({
            browserName: 'chrome'
          }).then(() => chrome.doOpenIndex()
          .then(() => chrome.title().should.become("快捷网址导航-dh.zhoushoujian.com"))
          .then(() => chrome.quit()))) */
    })
})