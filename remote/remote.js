require("../basic/chrome");
var crypt = require("./crypt");
var http = require("http");
var remote_ip = ["192.168.1.108"];
var remote_port = 8080;
module.exports = function (i, f, params, ...args) {
    if (!(params instanceof Array) || args.length) {
        arguments.length > 1 && args.unshift(params);
    } else {
        args = params;
    }
    params = JSON.stringify(args, function (p, o) {
        for (var k in o) {
            var v = o[k]
            o[k] = v instanceof Function ? v() : v;
        }
        return o;
    }, 4);
    var options = {
        port: remote_port,
        hostname: remote_ip[i],
        method: 'POST',
        path: '/remote/exec'
    }
    return new Promise(function (resolve, reject) {
        var req = http.request(options, function (res) {
            var chunks = [];
            res.on("data", function (data) {
                chunks.push(data);
            });
            res.on("end", function () {
                let data;
                if (res.statusCode !== 200) {
                    data = String(crypt.decrypt(Buffer.concat(chunks), "A error happened"));
                    console.warn(func);
                    return reject("oh error " + res.statusCode + ":" + data);
                }
                data = String(crypt.decrypt(Buffer.concat(chunks), "one more kiss that is no crazy"));
                return resolve.apply(null, JSON.parse(data));
            });
        });
        req.on("error", reject);
        var func = "return " + f.toString() + `.apply(this,${params})`;
        req.write(crypt.encrypt(func, "it\'s raining outside and I do miss you"));
        req.end();
    });
};