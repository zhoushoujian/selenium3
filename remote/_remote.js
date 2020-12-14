/**
 * /* eslint-disable no-useless-escape
 */

require("../basic/chrome");
const crypt = require("./crypt");

module.exports = {
    exec(req, res) {
        if (req.method !== "POST") {
            res.writeHead(403, {});
            res.end("请使用post方式发送");
        }
        const chunks = [];
        let size = 0;
        req.on("data", function (buff) {
            size = buff.length;
            chunks.push(buff);
        });
        req.on("end", function () {
            console.log(
                "收到客户端发来的数据:\n",
                String(crypt.decrypt(Buffer.concat(chunks, size), "it's raining outside and I do miss you")).replace(/^return\s+/, ""),
            );
            new Promise(function (resolve, reject) {
                // eslint-disable-next-line no-useless-escape
                // eslint-disable-next-line no-new-func
                new Function("return " + String(crypt.decrypt(Buffer.concat(chunks, size), "it's raining outside and I do miss you")).replace(/^return\s+/, ""))
                    .apply(this)
                    .then(resolve)
                    .catch(reject);
            })
                .then(function (...args) {
                    return res.end(crypt.encrypt(JSON.stringify(args), "one more kiss that is no crazy"));
                })
                .catch(function (e) {
                    res.writeHead(500, {});
                    return res.end(crypt.encrypt(String(e), "A error happened"));
                });
        });
    },
};
