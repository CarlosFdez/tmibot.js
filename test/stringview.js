var StringView = require('../lib/stringview.js');
var {expect} = require('chai');

describe("StringView", function() { 
    this.timeout(10000);
    
    describe("toString()", () => {
        it("should show entire string", () => {
            var view = new StringView("test string");
            expect(view.toString()).to.equal("test string");
        });

        it("should not consume string", () => {
            var view = new StringView("test string");
            view.toString();
            expect(view.toString()).to.equal("test string");
        });
    });

    describe("complete", () => {
        it("should return true on an empty string", () => {
            var view = new StringView("");
            expect(view.complete).to.be.true;
        });

        it("should return false on an unparsed view", () => {
            var view = new StringView("test string");
            expect(view.complete).to.be.false;
        });

        it("should return true on a consumed string", () => {
            var view = new StringView("test string");
            view.consumeRest();
            expect(view.complete).to.be.true;
        })
    });

    describe("skipWhitespace()", () => {
        it("does nothing if on character", () => {
            var view = new StringView("test");
            view.skipWhitespace();
            expect(view.toString()).to.equal("test");
        });

        it("skips over whitespace", () => {
            var view = new StringView("   test");
            view.skipWhitespace();
            expect(view.toString()).to.equal("test");
        });

        it("consumes entire string if only whitespace", () => {
            var view = new StringView("          ");
            view.skipWhitespace();
            expect(view.complete).to.be.true;
        });
    });

    describe("skipValue()", () => {
        it("doesn't skip if value doesn't match", () => {
            var view = new StringView("test");
            var skipValue = view.skipValue("hello");
            expect(view.toString()).to.equal("test", "expected string to remain");
            expect(skipValue).to.be.false;
        });

        it ("skips if value matches", () => {
            var view = new StringView("test");
            var skipValue = view.skipValue("te");
            expect(view.toString()).to.equal("st", "expected 'te' to be skipped");
            expect(skipValue).to.be.true;
        });
    })
})