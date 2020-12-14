/* eslint-disable global-require */
require("colors");
const fs = require("fs");
const wd = require("wd");
const chai = require("chai");
const path = require("path");
const Logger = require('beauty-logger')
const chaiAsPromised = require("chai-as-promised");
const childProcess = require("child_process")

const logger = new Logger({
    logFileSize: 1024 * 1024 * 10,
    logFilePath: path.join(__dirname, "../server.log"),
    dataTypeWarn: true,
    productionModel: false,
    enableMultipleLogFile: false
});
global.logger = logger

require('../function/setenv');

chai.use(chaiAsPromised);
chai.should()

//初始化WD环境
function ChromeTest() {
    const chromedriver = path.join(__dirname, "./_prebuilds/chromedriver.exe")
    childProcess.spawn(chromedriver, [
        "--port=4444",
        "--silent"
    ]);
    logger.info("开启一个连接端口  ok");
    chaiAsPromised.transferPromiseness = wd.transferPromiseness;
    chrome = wd.promiseChainRemote('http://localhost:4444');
    // optional extra logging
    /* chrome.on('status', function(info) {
        console.log(info.cyan);
    })
    chrome.on('command', function(eventType, command, response) {
        console.log(' > ' + eventType.cyan, command, (response || '').grey);
    })
    chrome.on('http', function(meth, path, data) {
        console.log(' > ' + meth.magenta, path, (data || '').grey);
    }) */
    const init = chrome.init;
    this.init = function () {
        const app = init.bind(chrome)({
            browserName: 'chrome',
            chromeOptions: {
                binary: process.env.CHROME_INSTALL_PATH
            }
        });
        logger.info("立即初始化wd，并实例化一个chrome对象  ok")
        return chrome._enrich(app);
    };
    return chrome;
}

//传入一个函数池，生成对应的异步操作链
const enrich = function (base, context = Promise.resolve(base)) {
    const promised = context;
    for (const k in base) {
        if (Object.prototype.hasOwnProperty.call(base, k)) {
            const core = base[k];
            promised[k] = core;
            for (const kk in core) {
                if (Object.prototype.hasOwnProperty.call(base, k)) {
                    const kc = core[kk];
                    promised[k][kk] = function () {
                        // eslint-disable-next-line prefer-rest-params
                        return kc.apply(global.chrome, arguments);
                    };
                }
            }
        }
    }
    logger.info("传入一个函数池，生成对应的异步操作链  ok");
    return promised;
};

//加载自定义的方法
fs.readdirSync(path.join(__dirname, "../action")).forEach(function (filename) {
    if (/_test\.js/i.test(filename)) return;
    try {
        const fullfilename = path.join(__dirname, `../action/${filename}`);
        // eslint-disable-next-line import/no-dynamic-require
        const action = require(fullfilename);
        ChromeTest[filename.replace(/\.js/, "")] = action;
    } catch (e) {
        logger.warn(`载入${filename}失败，请检查方法`);
    }
})
if (!process.env.APP_NAME) {
    logger.warn('PLEASE CHECK YOUR TEMP ENVIRONMENT VARIABLE');
}
const prototype = wd.PromiseChainWebdriver.prototype;
enrich(ChromeTest, prototype);
// eslint-disable-next-line new-parens
global.chrome = new ChromeTest;
logger.info("测试环境初始化成功");
