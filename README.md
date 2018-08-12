#基于WD.js的自动化测试框架

```js
//安装nodejs
npm install wd  
npm install chai 
npm install colors
npm install chai-as-promised
npm install --save-dev mocha 在全局也安装一次  npm install mocha -g
npm install --save-dev mochawesome 在全局也安装一次  npm install mochawesome -g
在测试过程中如果提示mocha不是内部命令也不是外部命令，说明需要配置以下mocha的环境变量
````
````js
//安装robotjs
npm install --save-dev robotjs  (copy D:\我的站点\test\deploy\_prebuilds\https-github.com-octalmage-robotjs-releases-download-v0.4.7-robotjs-v0.4.7-node-v48-win32-x64.tar.gz %appdata%\npm-cache\_prebuilds)
````

````安装chromedriver```` 
npm install chromedriver --chromedriver_cdnurl=https://npm.taobao.org/mirrors/chromedriver

执行方法 ： mocha script\simple

```