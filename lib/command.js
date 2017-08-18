class Command {
    constructor(name, callback, checks) {
        this.name = name;
        this.callback = callback;
        this.checks = checks || [];
        this.aliases = [];
    }

    addCheck(checkFn) {
        this.checks.push(checkFn);
    }

    alias(...names) {
        this.aliases = names;
    }

    invoke(ctx, argstring) {
        for (var check of this.checks) {
            if (!check(ctx)) {
                return;
            }
        }

        try {
            this.callback(ctx, argstring);
        } catch (e) {
            console.error(e);
            // todo: log it
        }
    }
}

class CommandCollection {
    constructor(checks) {
        // contains all direct commands mapped
        this.commands = [];
        this.subCollections = [];
        this.checks = checks || [];
    }

    addCommand(name, callback) {
        name = name.toLowerCase();
        let command = new Command(name, callback, this.checks);
        this.commands.push(command);
        return command;
    }

    filtered(...checks) {
        var combinedChecks = this.checks.concat(checks);

        var subCollection = new CommandCollection(combinedChecks);
        this.subCollections.push(subCollection);
        return subCollection;
    }

    // returns whether it found a command to execute or not
    invoke(ctx, commandName, argstring) {
        if (this.checkFn && !this.checkFn(ctx)) {
            return false; // failed check filter
        }

        for (var sub of this.subCollections) {
            if (sub.invoke(ctx, commandName, argstring)) {
                return true;
            }
        }

        for (var command of this.commands) {
            if (command.name == commandName || command.aliases.includes(commandName)) {
                command.invoke(ctx, argstring);
                return true;
            }
        }

        return false;
    }
}

module.exports = {
    Command: Command,
    CommandCollection: CommandCollection
}