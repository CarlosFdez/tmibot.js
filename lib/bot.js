var StringView = require('./stringview');
var Context = require('./context');
var {CommandGroupBase} = require("./command");

/**
 * Represents a twitch chat bot which wraps over a client
 * and supplies command parsing functionality.
 */
class Bot extends CommandGroupBase {
    /**
     * Constructs a new bot
     * @param {*} client - A tmi.js client to wrap
     * @param {Object} options - keyword arguments to configure the bot
     * @param {string} options.prefix - The prefix to use for the bot
     */
    constructor(client, { prefix='' }) {
        super();

        this.client = client;
        this.prefix = prefix;

        client.on("message", (channel, userstate, message, self) => {
            if (self) return;
    
            this.process(channel, userstate, message);
        });
    }

    process(channel, userstate, message) {
        let parser = new StringView(message);
        parser.skipWhitespace();
        if (!parser.skipValue(this.prefix)) {
            return;
        }

        let ctx = new Context(this.client, channel, userstate);
        this.invoke(ctx, parser);
    }
}

module.exports = Bot
