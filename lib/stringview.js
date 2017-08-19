// The StringView class name came from something included in discord.py, although the implementation is my own.

/**
 * Represents a forward only string parser ideally used to extract arguments.
 */
class StringView {
    /**
     * Constructs a new forward only string parser that analyzes a given string
     * @param {string} str 
     */
    constructor(str) {
        this.str = str;
        this.position = 0;
    }

    /**
     * Returns whether the parser has been exhausted or not
     * @returns bool
     */
    get complete() {
        return this.position >= this.str.length;
    }

    /**
     * Tells the parser to skip over whitespace. 
     * Does nothing if there is no whitespace at the current position.
     */
    skipWhitespace() {
        while (!this.complete && this.str[this.position] == ' ') {
            this.position++;
        }
    }

    /**
     * Attempt to skip over a value. Returns true on success, false on failure.
     * @param {string} value The value to skip
     */
    skipValue(value) {
        if (this.str.startsWith(value, this.position)) {
            this.position += value.length;
            return true;
        }
        return false;
    }

    /**
     * Skip over a single word (after skipping whitespace), and then returns the word.
     * @returns {String} - the word that was stepped over by the parser
     */
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

    /**
     * Consumes the remainder of the string without parsing.
     * If you only want to peek at the rest of the string, call toString().
     * @returns {String} - the remainder of the string
     */
    consumeRest() {
        let rest = this.str.substring(this.position);
        this.position = this.str.length;
        return rest;
    }

    /** 
     * Consumes the rest of the string, and splits it into words.
     * Space, comma, and semicolon are used as delimeters. 
     * @returns {string[]} - the split list of words
     */
    consumeSplitWords() {
        var rest = this.consumeRest().replace(/,|;/g, " ").trim();
        var items = rest.split(/\s/g).filter((item) => item != "");

        return items;
    }

    /**
     * Shows the rest of the string without moving the position
     */
    toString() {
        return this.str.substring(this.position);
    }
}

module.exports = StringView
