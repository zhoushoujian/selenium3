/* global describe, it, before , beforeEach, after*/
require("colors");
var fs = require("fs");
var wd = require("wd");
var chai = require("chai");
var path = require("path");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();
global.logger = require('./logger');
require('../function/setenv');
//require('../function/console');
//初始化WD环境
function ChromeTest(){
  var chromedriver = path.join(__dirname,"./_prebuilds/chromedriver.exe")
  require("child_process").spawn(chromedriver,[
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
  var init = chrome.init;
  this.init = function(){
      var app = init.bind(chrome)({
          browserName:'chrome',
          chromeOptions:{
              binary: process.env.CHROME_INSTALL_PATH
          }
        });
      logger.info("立即初始化wd，并实例化一个chrome对象  ok")
      return chrome._enrich(app);
  };
  return chrome;
}

//传入一个函数池，生成对应的异步操作链
var enrich = function(base,context = Promise.resolve(base)){
  var promised = context;
  for(var k in base){
      let core = base[k];
      promised[k] = core;
      for(var kk in core){
          let kc = core[kk];
          promised[k][kk] = function(){
              return kc.apply(global.chrome,arguments);
          };
      }
  }
  logger.info("传入一个函数池，生成对应的异步操作链  ok");
  return promised;
};

//加载自定义的方法
fs.readdirSync(path.join(__dirname,"../action")).forEach(function(filename){
 if(/_test\.js/i.test(filename)) return ;
 try{
     let fullfilename = path.join(__dirname,`../action/${filename}`);
     let action = require(fullfilename);
     ChromeTest[filename.replace(/\.js/,"")] = action;
 } catch(e){
     logger.warn (`载入${filename}失败，请检查方法`);
 }
})
if(!process.env.APP_NAME){
    logger.warn('PLEASE CHECK YOUR TEMP ENVIRONMENT VARIABLE');
}
var prototype = wd.PromiseChainWebdriver.prototype;
enrich(ChromeTest,prototype);
global.chrome = new ChromeTest;
logger.info("测试环境初始化成功");