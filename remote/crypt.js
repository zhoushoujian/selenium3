var default_sign = "你不知道我为什么狠下心，盘旋在你看不见的高空里，多的是，你不知道的事"
var crypt = encode = decode = module.exports = function(data, sign){
  var buff = Buffer.from(data)   //将函数转换为buffer对象
  var ssrc = Buffer.concat([Buffer.from(sign),Buffer.from(sign.length + "")])
  var next = ssrc[0]  //这个地方是一个固定值 ：51 
  //console.log("next",next)
  for (var cx = 0,dx = buff.length;cx < dx; cx++){
      buff[cx] = buff[cx] ^ next  //^异或运算符
      //console.log("buff[cx]",buff[cx])
      next = ssrc[(next + cx) % ssrc.length]
  }
  return buff
}

//有时效限制的加密解密算法，服务器时间要和客户机时间同步
crypt.timevalid = 120000
crypt.encrypt = function(data,sign){
    var timevalid = crypt.timevalid
    var time = Date.now() - timevalid   //Date.now()获取当前距1970年一月一号的毫秒数
    timevalid <<= 1   //右移符号，相当于x2
    var 余 = (time % timevalid).toString(36)  //时刻在变化   如"o796"
    var 商 = parseInt(time / timevalid).toString(36)  //每两分钟变化一次  如"r0j2"
    sign = Buffer.concat([Buffer.from(商),Buffer.from(sign)])   //每两分钟变化一次  
    var time_signed = encode(商,sign)    
    console.log("余",余,"商",商,"time_signed",time_signed)
    return Buffer.concat([Buffer.from(余.length + 余), time_signed, encode(data,sign)])
}
crypt.decrypt = function(buff,sign){
    var timevalid = crypt.timevalid
    var time = Date.now()
    timevalid <<= 1
    var size = parseInt(String(buff.slice(0,1)))
    var time_start = size + 1
    var 余 = String(buff.slice(1,time_start))
    var 商 = parseInt((time - parseInt(余,36)) / timevalid).toString(36)
    var data_start = time_start + 商.length
    var time_signed = buff.slice(time_start,data_start)
    sign = Buffer.concat([Buffer.from(商),Buffer.from(sign)])
    if(Buffer.compare(encode(商,sign),time_signed)){
        console.log("超时！")
        return;
    }
    return decode(buff.slice(data_start),sign)
}