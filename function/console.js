{
    let colors = {
        Reset : "\x1b[0m",
        FgRed : "\x1b[31m",
        FgGreen : "\x1b[32m",
        FgYellow : "\x1b[33m",
        FgBlue : "\x1b[34m"
    };
    var length  = 0;
    "info::FgBlue,warn:警告:FgYellow,error::FgRed".split(",").forEach(function(logcolor){
        var [log,info,color] = logcolor.split(':');
        var logger = function(...args){
            var message = args.join(" ");
            process.stdout.write("\b \b".repeat(length<<1)+message);
            length = message.length;
        } || console[log] || console.log;
        console[log] = (...args) => logger.apply(null,[`${colors[color]}${info || log.toUpperCase()}${colors.Reset}`,...args]);
    });
}