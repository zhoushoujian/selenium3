require('../function/console');
var http = require("http");
var fs = require("fs");
var path = require("path");
var cluster = require("cluster");
if (cluster.isMaster) {
    return function () {
        let work = function () {
            if (work.inf) return;
            work.inf = true;
            const worker = cluster.fork();
            worker.on('exit', (code, signal) => {
                if (signal) {
                    console.warn('worker was killed by signl', signal);
                } else if (code !== 0) {
                    console.warn("worker exited with error", code);
                } else {
                    console.log("worker success!");
                }
            });
        };
        work();
    }();
}
var handle = module.exports = {
    "/local/ip": function () {
        var os = require("os")
        var address;
        var networks = os.networkInterfaces()
        Object.keys(networks).forEach(function(k){
             for( var kk in networks[k] ){
                   if(networks[k][kk].family === "IPv4" && networks[k][kk].address !== "127.0.0.1"){
                       address = networks[k][kk].address;
                        return address;
                   }
             }
        })
        return address;
    }
};

//加载远程过程调用
{
    var remote = require("./_remote")
    for (let k in remote) {
        handle["/remote/" + k] = remote[k];
    }
}

var server = http.createServer((req,res) => {
    var url = req.url;
    if(handle[url]){
        if(url.slice(1,7).toLowerCase() === "remote"){
            return handle[url](req,res);
        }
    }
    res.setHeader('Content-Type','text/javascript;charset=UTF-8');
    var filename = url.pathname.substring(1),type;
    switch (filename.substring(filename.lastIndexOf('.')+1)){
        case'html':
        case 'htm':
            type = 'text/html;charset=UTF-8'; break;
        case 'js':
            type = 'application/javascript;charset=UTF-8'; break;
        case 'css':
            type = 'text/css;charset=UTF-8'; break;
        case 'txt':
            type = 'text/plain;charset=UTF-8'; break;
        case 'manifest':
            type = 'text/cache-manifest;;charset=UTF-8'; break;
        default:
            type = 'application/octet-stream'; break;
    }
    res.end(function () {
        return fs.readFileSync(url);
    });
});
server.listen({
    port: 8080,
    exclusive: true
});
server.on("listening", function () {
    console.log('启动服务成功！')
    process.title = `welink Test Server (http://${handle["/local/ip"]()}:8080)`;
});
server.on("error",function(error){
    console.warn(`服务端口8080正在使用中 : ${error}`)
});

process.on('SIGERM', function (code) {
    console.log("本程序运行了", process.uptime());
    process.exit(0);
});

console.log("process.pid", process.pid)
