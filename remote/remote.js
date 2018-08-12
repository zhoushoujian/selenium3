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
    return new Promise(function (ok, oh) {
        var req = http.request(options, function (res) {
            var chunks = []
            res.on("data", function (data) {
                chunks.push(data)
            });
            res.on("end", function () {
                if (res.statusCode !== 200) {
                    var data = String(crypt.decrypt(Buffer.concat(chunks), "你看得到我打在屏幕上的字，却看不到我落在键盘上的泪。"))
                    console.log(func);
                    return oh("oh error " + res.statusCode + ":" + data);
                }
                var data = String(crypt.decrypt(Buffer.concat(chunks), "请你不要再迷恋我，我只是一个传说"))
                return ok.apply(null, JSON.parse(data));
            });
        });
        req.on("error", oh);
        var func = "return " + f.toString() + `.apply(this,${params})`;
        req.write(crypt.encrypt(func, "多少风沙，多少汗水。多少辛酸，带走我的泪。"));
        req.end();
    });
};