const assert = require('assert');
const crypt = require('./crypt');

describe("crypt test", function () {
    this.timeout(5000);
    before(function () {
        //
    })
    it('standard test', function () {
        const src = crypt.encrypt("standard");
        const dst = crypt.decrypt(src);
        assert.ok(String(dst) === "standard");
    })
    it("test similar", function () {
        const src = crypt.encrypt("1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", '庐州月光，洒在心上，如今的你又在谁的身旁');
        assert.ok((src.toString().match(/[1234567890abcdefghijklmnopqrstuvwxyz]/gi).length) >= 9);
    })
    it('test same key', function () {
        const src = crypt.encrypt("same key", "依然不变的仰望，满天迷人的星光");
        const dst = crypt.decrypt(src, "依然不变的仰望，满天迷人的星光");
        assert.ok(String(dst) === "same key");
    })
    it("test timeout time", function (done) {
        this.timeout(250);
        crypt.timevalid = 120;
        const src = crypt.encrypt("time", "天在下雨我在想你");
        setTimeout(function () {
            const dst = crypt.decrypt(src, "天在下雨我在想你");
            assert.notEqual(String(dst), "time");
            done()
        }, 150)
    })
    it("test diff key", function () {
        const src = crypt.encrypt("diff key", "你说孤独是诗人应该具有的体会，写歌的人就该有伤悲");
        const dst = crypt.decrypt(src, "你说孤独是诗人应该具有的体会");
        assert.notDeepEqual(String(dst), "diff key");
    })
})
