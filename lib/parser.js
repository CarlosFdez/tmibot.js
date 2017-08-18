class Parser {
    constructor(str) {
        this.str = str;
        this.position = 0;
    }

    get complete() {
        return this.position >= this.str.length;
    }

    skipWhitespace() {
        while (!this.complete && this.str[this.position] == ' ') {
            this.position++;
        }
    }

    consumeWord() {
        this.skipWhitespace();

        let nextWhitespaceIdx = this.str.indexOf(' ', this.position);
        if (nextWhitespaceIdx == -1) {
            nextWhitespaceIdx = this.str.length;
        }

        let word = this.str.substring(this.position, nextWhitespaceIdx);
        this.position = nextWhitespaceIdx;

        return word;
    }

    consumeRest() {
        let rest = this.str.substring(this.position);
        this.position = this.str.length;
        return rest;
    }

    /** Consume every word split by a delimeter (space, comma, semicolon) */
    consumeSplitWords() {
        var rest = this.consumeRest().replace(/,|;/g, " ").trim();
        var items = rest.split(/\s/g).filter((item) => item != "");

        return items;
    }

}

module.exports = Parser
