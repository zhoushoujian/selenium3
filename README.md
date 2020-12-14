# node.js的自动化测试框架

```nodejs自动化测试框架，基于selenium3```

## Install

```shell
npm i
npm run start
```

## Usage

测试脚本统一写在scripts文件夹里，共用方法统一放在action文件夹里

remote文件夹里存放的是调用远程机器自动化测试的框架，如不需要，忽略即可

basic文件夹里的chrome_test演示的是对比图片来断言测试结果，需要先安装python

## 如果chromedriver安装不上，试试下面这个命令

npm install chromedriver --chromedriver_cdnurl=https://npm.taobao.org/mirrors/chromedriver
