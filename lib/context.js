class Context {
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

    reply(message) {
        this.client.say(this.channel, message);
    }
}

module.exports = Context
