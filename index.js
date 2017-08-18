var Bot = require('./lib/bot');

/**
 * Creates a new Bot class that wraps over the given client.
 * @param {*} client 
 * @param {*} prefix
 * @returns {Bot}
 */
function create_bot(client, prefix) {
    let bot = new Bot(client, prefix);

    client.on("message", (channel, userstate, message, self) => {
        if (self) return;

        bot.process(channel, userstate, message);
    });

    return bot;
}

module.exports = {
    create_bot: create_bot
}