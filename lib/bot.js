var Parser = require('./parser');
var Context = require('./context');
var {Command, CommandCollection} = require("./command");

class Bot {
    constructor(client, prefix) {
        this.client = client;
        this.prefix = prefix;
        this.commands = new CommandCollection();
    }

    /**
     * Adds a command to the bot. The callback will be invoked when the command is executed
     * @param {string} name - The name used to invoke the command. Do not include the prefix.
     * @param {commandCallback} callback - The function invoked when the command is executed.
     * @returns {Command} The created command object
     */
    addCommand(name, callback) {
        return this.commands.addCommand(name, callback);
    }

    filtered(checkFn) {
        return this.commands.filtered(checkFn);
    }

    process(channel, userstate, message) {
        message = message.trimLeft();
        if (!message.startsWith(this.prefix)) {
            return;
        }

        message = message.substring(this.prefix.length);

        let ctx = new Context(this.client, channel, userstate);

        var parser = new Parser(message);
        var commandName = parser.consumeWord();
        var argstring = parser.consumeRest();

        if (commandName != "") {
            commandName = commandName.toLowerCase();
            this.commands.invoke(ctx, commandName, argstring);
        }
    }

    /**
     * @callback commandCallback
     * @param {Context} context - The context of the command. Includes the author and the message.
     * @param {args} args - The string containing the remainder of the command
     */
}

module.exports = Bot
