var StringParser = require('./stringparser');
var Context = require('./context');
var {Command, CommandCollection} = require("./command");

class Bot {
    constructor(client, prefix) {
        this.client = client;
        this.prefix = prefix;
        this.commands = new CommandCollection();
    }

    /**
     * Adds a command to the bot.
     * @param {string} name - The name used to invoke the command. Do not include the prefix.
     * @param {function(Context, string)} callback - The function invoked when the command is executed.
     * @returns {Command} The created command object
     */
    addCommand(name, callback) {
        return this.commands.addCommand(name, callback);
    }

    filtered(checkFn) {
        return this.commands.filtered(checkFn);
    }

    process(channel, userstate, message) {
        var parser = new StringParser(message);
        parser.skipWhitespace();
        if (!parser.skipValue(this.prefix)) {
            return;
        }

        let ctx = new Context(this.client, channel, userstate);

        var commandName = parser.consumeWord();
        var argstring = parser.consumeRest();

        if (commandName != "") {
            commandName = commandName.toLowerCase();
            this.commands.invoke(ctx, commandName, argstring);
        }
    }
}

module.exports = Bot
