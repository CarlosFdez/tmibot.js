var StringView = require('./stringview');
var Context = require('./context');
var {Command, CommandCollection} = require("./command");

/**
 * Represents a twitch chat bot which wraps over a client
 * and supplies command parsing functionality.
 */
class Bot {
    /**
     * Constructs a new bot
     * @param {*} client - A tmi.js client to wrap
     * @param {Object} options - keyword arguments to configure the bot
     * @param {string} options.prefix - The prefix to use for the bot
     */
    constructor(client, { prefix='' }) {
        this.client = client;
        this.prefix = prefix;
        this.commands = new CommandCollection();

        client.on("message", (channel, userstate, message, self) => {
            if (self) return;
    
            this.process(channel, userstate, message);
        });
    }

    /**
     * Adds a command to the bot.
     * @param {string} name - The name used to invoke the command. Do not include the prefix.
     * @param {function(Context, StringView)} callback - The function invoked when the command is executed.
     * @returns {Command} The created command object
     */
    addCommand(name, callback) {
        return this.commands.addCommand(name, callback);
    }

    filtered(checkFn) {
        return this.commands.filtered(checkFn);
    }

    process(channel, userstate, message) {
        var parser = new StringView(message);
        parser.skipWhitespace();
        if (!parser.skipValue(this.prefix)) {
            return;
        }

        let ctx = new Context(this.client, channel, userstate);

        var commandName = parser.consumeWord();

        if (commandName != "") {
            commandName = commandName.toLowerCase();
            this.commands.invoke(ctx, commandName, parser);
        }
    }
}

module.exports = Bot
