require("../basic/chrome");
var crypt = require("./crypt");
module.exports = {
    exec(req,res){
        if(req.method != "POST"){
            res.writeHead(403,{});
            res.end("请使用post方式发送");
        }
        var chunks = [];
        var size = 0;
        req.on("data",function(buff){
           size = buff.length;
           chunks.push(buff);
        })
        req.on("end",function(data){
          new Promise(function(resolve,reject){
             new Function("return " + String(crypt.decrypt(Buffer.concat(chunks), "多少风沙，多少汗水。多少辛酸，带走我的泪。")).replace(/^return\s+/,"")).apply(this).then(resolve).catch(reject);
          }).then(function(...args){
              return res.end(crypt.encrypt(JSON.stringify(args), "请你不要再迷恋我，我只是一个传说"))
          }).catch(function(e){
              res.writeHead(500,{})
              return res.end(crypt.encrypt(String(e), "你看得到我打在屏幕上的字，却看不到我落在键盘上的泪。"))
          });
        });
    }
}