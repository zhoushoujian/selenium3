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
             new Function("return " + String(crypt.decrypt(Buffer.concat(chunks), "it\'s raining outside and I do miss you")).replace(/^return\s+/,"")).apply(this).then(resolve).catch(reject);
          }).then(function(...args){
              return res.end(crypt.encrypt(JSON.stringify(args), "one more kiss that is no crazy"))
          }).catch(function(e){
              res.writeHead(500,{})
              return res.end(crypt.encrypt(String(e), "A error happened"));
          });
        });
    }
}