var open = module.exports = function (done) {
  return chrome.get("http://www.2126057.cn").windowHandle()
    .then((s) => chrome.maximize(s))
    .nodeify(done)
}      