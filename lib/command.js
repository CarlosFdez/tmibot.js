/**
 * Represents a command with a name that can be invoked.
 * You can create these via the bot object.
 */
class Command {
    constructor(name, callback, checks=[]) {
        this.name = name;
        this.callback = callback;
        this.checks = checks;
    }

    /**
     * Adds a function used to check for authorization to use this command.
     * You can either use this function, or create a CommandFilter
     * @param {function(Context)[]} checkFns - one or more functions 
     */
    addChecks(...checkFns) {
        this.checks.push(...checkFns);
    }

    /**
     * Attempts to invoke this command.
     * This will usually be called by the internal system.
     * @param {Context} ctx 
     * @param {StringView} view 
     */
    invoke(ctx, view) {
        for (var check of this.checks) {
            if (!check(ctx)) {
                return;
            }
        }

        try {
            this.callback(ctx, view);
        } catch (e) {
            console.error(e);
            // todo: log it
        }
    }
}

/**
 * Represents any object that can contain multiple commands.
 */
class CommandGroupBase {
    constructor() {
        this.commands = {};
        this.checks = []
    }

    /**
     * Register an already existing command object, and then return it
     * @param {Command} command 
     */
    registerCommand(command) {
        if (!command.name) {
            throw new TypeError("Command must have a name");
        }
        if (command.name in this.commands) {
            // todo: custom error type
            throw new Error("Command " + command.name + " is already registered");
        }
        this.commands[command.name] = command; // todo: throw if already exists
    }

    /**
     * Adds new sub-command to the bot.
     * @param {string} name - The name used to invoke the command. Do not include the prefix.
     * @param {function(Context, StringView)} callback - The function invoked when the command is executed.
     * @returns {Command} The created command object
     */
    addCommand(name, callback) {
        let command = new Command(name.toLowerCase(), callback);
        this.registerCommand(command);
        return command;
    }

    /**
     * Adds a GroupCommand to the bot, and then returns it.
     * You can then add commands to the returned group.
     * @param {string} name - The name used to invoke the group 
     * @param {*} callback 
     * @returns {CommandGroup}
     */
    addGroup(name) {
        let group = new GroupCommand(name.toLowerCase());
        this.registerCommand(group);
        return group;
    }

    /**
     * Adds a function used to check for authorization for every registered commmand.
     * @param {function(Context)[]} checkFns - one or more check functions 
     */
    addChecks(...checkFns) {
        this.checks.push(...checkFns);
    }

    /**
     * Creates a new CommandFilter that will add commands to this bot with additional checks.
     * Check functions return true if the bot is allowed to execute the command.
     * @param {function(Context)} checks - one or more check functions
     * @returns {CommandFilter}
     */
    filtered(...checks) {
        // our invoke already processes checks, so we don't need to pass ours
        return new CommandFilter(this, checks);
    }

    /**
     * Invokes one of the registered commands by examining the view.
     * This will usually be called by the internal system.
     * @param {*} ctx 
     * @param {StringView} view 
     */
    invoke(ctx, view) {
        for (var check of this.checks) {
            if (!check(ctx)) {
                return;
            }
        }

        let commandName = view.consumeWord();
        let command = this.commands[commandName.toLowerCase()];
        if (command) {
            command.invoke(ctx, view);
        }
    }
}

/**
 * A command that contains multiple sub commands.
 * Essentially this is a command group with a name.
 */
class GroupCommand extends CommandGroupBase {
    constructor(name) {
        super();
        this.name = name;
    }
} 

/**
 * Represents A command filter used to add checks to every command below it.
 */
class CommandFilter {
    constructor(parent, checks=[]) {
        this.parent = parent;
        this.checks = checks;
    }

    /**
     * Adds new command to the bot. 
     * The created command will have the registered filters applied to it.
     * @param {string} name - The name used to invoke the command. Do not include the prefix.
     * @param {function(Context, StringView)} callback - The function invoked when the command is executed.
     * @returns {Command} The created command object
     */
    addCommand(name, callback) {
        var cmd = this.parent.addCommand(name, callback);
        cmd.addChecks(...this.checks);
        return cmd;
    }

    /**
     * Adds a GroupCommand to the bot, and then returns it.
     * You can then add commands to the returned group.
     * The created group will have the registered filters applied to it.
     * @param {string} name - The name used to invoke the group 
     * @param {*} callback 
     * @returns {CommandGroup}
     */
    addGroup(name) {
        var cmd = this.parent.addGroup(name);
        cmd.addChecks(...this.checks);
        return cmd;
    }

    filtered(...checks) {
        var combinedChecks = this.checks.concat(checks);
        return new CommandFilter(this.parent, combinedChecks);
    }
}

module.exports = {
    Command,
    CommandGroupBase,
    GroupCommand,
    CommandFilter
}
