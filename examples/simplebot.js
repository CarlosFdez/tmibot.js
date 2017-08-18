var tmi = require("tmi.js");
var tmibot = require("tmibot.js");

// note: it is good practice not to include config files in source control
var config = require("./config.json");

// config options are the same as normal tmi.client
var client = new tmi.client(config.tmi);
var bot = tmibot.create_bot(client);

bot.addCommand("ping", (ctx, args) => {
    ctx.reply("pong");
});

client.connect();