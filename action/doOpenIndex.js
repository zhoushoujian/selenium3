const open = function (done) {
    return chrome.get("https://www.zhoushoujian.com").windowHandle()
    .then((s) => chrome.maximize(s))
    .nodeify(done)
}      

module.exports = open
