# TMIBot.js

A javascript library that wraps over [tmi.js](https://github.com/tmijs/tmi.js) to support bot command parsing. This is really new and highly subject to change. Some ideas came from various discord bot libraries (mostly discord.py).

I wrote this mostly for my own use, but if you want feel free to use it. You can contact me on [Twitter](https://twitter.com/MeSoSupe) if you need anything.

## How to install

Its currently not on NPM, so you'd have to do:

`npm install https://github.com/CarlosFdez/tmibot.js.git`

## Example

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

## Documentation

Unfortunately there isn't any at this time. However, I did write JSDoc comments, so an editor with intelligent code completion is enough. I personally use [Visual Studio Code](https://code.visualstudio.com/).
