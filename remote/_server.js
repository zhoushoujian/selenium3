const http = require("http");
const fs = require("fs");
const os = require("os")
const cluster = require("cluster");
const remote = require("./_remote")

const IS_RUNNING_AS_SERVER = require.main === module;
process.mainModule.IS_RUNNING_AS_SERVER = IS_RUNNING_AS_SERVER
if (IS_RUNNING_AS_SERVER && cluster.isMaster) {
    return function () {
        const work = function () {
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
const handle = {
    "/local/ip": function () {
        let address;
        const networks = os.networkInterfaces()
        Object.keys(networks).forEach(function(k){
            for( const kk in networks[k] ){
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
for (const k in remote) {
    if (Object.prototype.hasOwnProperty.call(remote, k)) {
        handle["/remote/" + k] = remote[k];
    }
}

const server = http.createServer((req, res) => {
    const url = req.url;
    if(handle[url]){
        if(url.slice(1, 7).toLowerCase() === "remote"){
            return handle[url](req, res);
        }
    }
    res.setHeader('Content-Type', 'text/javascript;charset=UTF-8');
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
server.on("error", function(error){
    console.warn(`服务端口8080正在使用中 : ${error}`)
});

process.on('SIGERM', function (_code) {
    console.log("本程序运行了", process.uptime());
    process.exit(0);
});

console.log("process.pid", process.pid)

module.exports = handle;
