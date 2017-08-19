# TMIBot.js

A javascript library that wraps over [tmi.js](https://github.com/tmijs/tmi.js) to support bot commands. This is really new and highly subject to change.

## Why a new library
TMI.js is barebones, and does not support command parsing. So I wrote a command parser and shared it. Some ideas came from various discord bot libraries (mostly discord.py).

## Examples

```js
var tmi = require("tmi.js");
var tmibot = require("tmibot.js");

// note: it is good practice not to include config files in source control
var config = require("./config.json");

// config options are the same as normal tmi.client
var client = new tmi.client(config.tmi);
var bot = new tmibot.bot(client, { prefix: '!' });

bot.addCommand("hello", (ctx, args) => {
    ctx.reply("Hello " + ctx.author.name);
});

bot.addCommand("echo", (ctx, args) => {
    ctx.reply(args.toString());
})

client.connect();
```

More examples are in the examples/ folder.
