/*
 * @Author: zhoushoujian 
 * @Date: 2018-06-05 15:18:11 
 * @Last Modified by: zhoushoujian
 * @Last Modified time: 2018-08-15 23:18:27
 */
require('colors')
const chokidar = require('chokidar');
const path = require('path');
const {
    exec
} = require('child_process');
let arrayList = [];
let pid;
const dst_path = path.join(__dirname, "../../");
const server_file = path.join(__dirname, "./_server");

//监听文件变化 
const watcher = chokidar.watch(dst_path, {
    ignored: /(^|[\/\\])\..|node_modules/,
    persistent: true
});

//主进程pid号
console.log("main process pid", process.pid)
//当所有文件全部被监视时触发
watcher.on('ready', () => console.log('Initial scan complete. Ready for changes'))

//启动服务
let main = function () {
    let child = exec(`node ${server_file}`);
    child.stdout.on('data', function (data) {
        arrayList.push(data);
        console.log("stdout", data);
    });
    child.stderr.on('data', function (data) {
        console.log("stderr", data);
    });
    child.on('exit', function (code) {
        console.log('子进程已退出，代码：' + code);
    });
};

//监听事件的输出 
setTimeout(function () {
    console.log("start to listen to output".green);
    watcher
        .on('error', error => console.log(`Watcher error: ${error}`.bold.red))
        .on('all', (event, path) => {
            pid = arrayList.join(" ").split("process.pid").slice(-1).toString().split("\n").slice(0, 1).join(" ").trim();
            let kill = setInterval(() => {
                if (main instanceof Function) {
                    process.kill(pid);
                    main = null;
                }
                setTimeout(() => {
                    if (!main) {
                        main = function () {
                            let child = exec(`node ${server_file}`);
                            child.stdout.on('data', function (data) {
                                arrayList.push(data);
                                console.log("stdout", data);
                            });
                            child.stderr.on('data', function (data) {
                                console.log("stderr", data);
                            });
                            child.on('exit', function (code) {
                                console.log('子进程已退出，代码：' + code);
                            });
                        };
                        main();
                        setTimeout(() => console.log("新一轮的服务器监听已经启动".green),4000);
                    }
                }, 5000); //处理完所有事件后再监听服务器  
                clearInterval(kill);
            }, 5000); //收集所有事件，完毕后一起处理   
            console.log(event, path);
        });
}, 5000);

//首次调用时启动服务器    
main();

//捕获异常
process.on('uncaughtException', function (err) {
    if (err == "Error: kill ESRCH") {
        console.log("子进程已退出");
    } else {
        console.log('Caught exception: ' + err);
    }
});