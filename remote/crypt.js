var default_sign = "put your text here";
var crypt = encode = decode = module.exports = function(data, sign = default_sign){
  var buff = Buffer.from(data);
  //                         加解密函数传过来的sign         这个长度一般是2
  var ssrc = Buffer.concat([Buffer.from(sign),Buffer.from(sign.length + "")]);
  var next = ssrc[0];  //这个地方是一个固定值
  //不管密钥怎么变，只要data和sign是同一个字符串，运行两次即可实现加解密
  for (var cx = 0,dx = buff.length;cx < dx; cx++){
      buff[cx] = buff[cx] ^ next;  //^异或运算符
      next = ssrc[(next + cx) % ssrc.length];  //动态更改key
  }
  //加密前后buff的长度不变
  return buff;
};

//有时效限制的加密解密算法，服务器时间要和客户机时间同步
crypt.timevalid = 120000;
crypt.encrypt = function(data,sign){
    var timevalid = crypt.timevalid;
    var time = Date.now() - timevalid;   //Date.now()获取当前距1970年一月一号的毫秒数
    timevalid <<= 1;   //右移符号，相当于x2
    var 余 = (time % timevalid).toString(36);  //固定的0-4位字符，最大值为‘2k1c’
    var 商 = parseInt(time / timevalid).toString(36);  //固定的5位字符,如7m0rh
    sign = Buffer.concat([Buffer.from(商),Buffer.from(sign)]);   //每两分钟变化一次  
    var time_signed = encode(商,sign);  //字符长度为商的长度，也就是5
    //console.log("余",余,"商",商,"time_signed",time_signed)
    //                                  4-5个buffer    
    return Buffer.concat([Buffer.from(余.length + 余), time_signed, encode(data,sign)])
};
crypt.decrypt = function(buff,sign){
    var timevalid = crypt.timevalid;
    var time = Date.now();
    timevalid <<= 1;
    var size = parseInt(String(buff.slice(0,1)));  //这个数字保存了余数的长度  
    var time_start = size + 1;  //这个数字是time_signed的起始位置
    var 余 = String(buff.slice(1,time_start));  //截取出加密前的余数
    var 商 = parseInt((time - parseInt(余,36)) / timevalid).toString(36);  //得出加密前的商
    var data_start = time_start + 商.length;  //在余数的长度基础上加上商的长度就等于数据的起始位置
    var time_signed = buff.slice(time_start,data_start);  //截取出加密前的time_signed
    //原来的商加相等的sign，得到的sign和加密前的相同
    sign = Buffer.concat([Buffer.from(商),Buffer.from(sign)]);
    if(Buffer.compare(encode(商,sign),time_signed)){
        //如果加密前后的数据不相同，就抛出错误
        console.warn("超时！");
        return;
    }
    //加密前的数据和相同的sign，完美实现解密
    return decode(buff.slice(data_start),sign);
};