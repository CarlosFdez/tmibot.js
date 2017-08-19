var tmi = require("tmi.js");
var tmibot = require("tmibot.js");

// note: it is good practice not to include config files in source control
var config = require("./config.json");

// config options are the same as normal tmi.client
var client = new tmi.client(config.tmi);
var bot = new tmibot.bot(client, { prefix: '!' });

bot.addCommand("ping", (ctx, args) => {
    ctx.reply("pong");
});

bot.addCommand("hello", (ctx, args) => {
    ctx.reply("Hello " + ctx.author.name);
});

bot.addCommand("echo", (ctx, args) => {
    ctx.reply(args.toString());
})

client.connect();