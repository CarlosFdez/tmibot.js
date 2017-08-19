var client = require("tmi.js").client;

class Context {
    /**
     * Creates a new Context. These are created by the bot
     * @param {client} client 
     * @param {string} channel 
     * @param {*} userstate 
     */
    constructor(client, channel, userstate) {
        this.client = client;
        this.channel = channel;
        this.userstate = userstate;
    }

    get author() {
        return {
            name: this.userstate['display-name'],
            username: this.userstate['username']
        }
    }

    hasBadge(badgeName) {
        return badgeName in this.userstate['badges'];
    }

    /**
     * 
     * @param {string} message_str - the message to send
     * @return {Promise}
     */
    reply(message_str) {
        if (!(typeof(message_str) === 'string' || message_str instanceof String)) {
            throw new TypeError("Invalid type, message must be a string");
        }
        return this.client.say(this.channel, message_str);
    }
}

module.exports = Context
