/* eslint-disable camelcase */
require("../basic/chrome");
const http = require("http");
const crypt = require("./crypt");

const remote_ip = ["192.168.1.108"];
const remote_port = 8080;

module.exports = function (i, f, params, ...args) {
    if (!(params instanceof Array) || args.length) {
        arguments.length > 1 && args.unshift(params);
    } else {
        args = params;
    }
    params = JSON.stringify(args, function (p, o) {
        for (const k in o) {
            if (Object.prototype.hasOwnProperty.call(o, k)) {
                const v = o[k]
                o[k] = v instanceof Function ? v() : v;
            }
        }
        return o;
    }, 4);
    const options = {
        port: remote_port,
        hostname: remote_ip[i],
        method: 'POST',
        path: '/remote/exec'
    }
    return new Promise(function (resolve, reject) {
        const req = http.request(options, function (res) {
            const chunks = [];
            res.on("data", function (data) {
                chunks.push(data);
            });
            res.on("end", function () {
                let data;
                if (res.statusCode !== 200) {
                    data = String(crypt.decrypt(Buffer.concat(chunks), "A error happened"));
                    console.warn(func);
                    // eslint-disable-next-line prefer-promise-reject-errors
                    return reject("oh error " + res.statusCode + ":" + data);
                }
                data = String(crypt.decrypt(Buffer.concat(chunks), "one more kiss that is no crazy"));
                return resolve(JSON.parse(data));
            });
        });
        req.on("error", reject);
        const func = "return " + f.toString() + `.apply(this,${params})`;
        req.write(crypt.encrypt(func, "it\'s raining outside and I do miss you"));
        req.end();
    });
};
