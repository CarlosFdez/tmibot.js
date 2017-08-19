var {
    Command, GroupCommand, CommandGroupBase, CommandFilter
} = require("../lib/command");
var StringView = require("../lib/stringview.js");
var Context = require("../lib/context.js");

var {expect} = require('chai');

function fakeContext() {
    return new Context(null, "", {});
}

describe("CommandGroupBase", function () {
    describe("addCommand", () => {
        it("adds command to dictionary", () => {
            var base = new CommandGroupBase();
            base.addCommand("hello", () => {});
            expect(base.commands["hello"]).to.not.be.null;
        });

        it("fails if command already exists", () => {
            var base = new CommandGroupBase();
            base.addCommand("hello", () => {});
            expect(() => base.addCommand("hello", () => {})).to.throw();
        });
    });

    describe("filtered", () => {
        it("allows commands to be added to the base", () => {
            var base = new CommandGroupBase();
            base.filtered().addCommand("hello", () => {});
            expect(base.commands["hello"]).to.not.be.null;
        });

        it("allows group commands to be added to the base", () => {
            var base = new CommandGroupBase();
            var filter = base.filtered();
            var group = filter.addGroup("group");
            group.addCommand("hello", () => {});
            expect(base.commands["group"]).to.not.be.null;
            expect(base.commands["group"].commands["hello"]).to.not.be.null;
        })

        it("adds checks to commands added through it", () => {
            var base = new CommandGroupBase();
            var filter = base.filtered((ctx) => {});
            var cmd = filter.addCommand("hello", () => {});
            expect(cmd.checks).to.not.be.empty;
        });

        it("allows nesting", () => {
            var base = new CommandGroupBase();
            var filter = base.filtered((ctx) => {});
            filter = filter.filtered((ctx) => {}, (ctx) => {});
            var cmd = filter.addCommand("hello", () => {});
            expect(cmd.checks).to.have.lengthOf(3);
        });
    });

    describe("invoke", (done) => {
        it("calls the registered command", () => {
            var executed = false;
            var base = new CommandGroupBase();
            base.addCommand("test", () => { executed = true; });
            base.invoke(fakeContext(), new StringView("test"));

            expect(executed).to.be.true;
        });
        
        it("doesn't execute if the check fails", () => {
            var executed = false;
            var base = new CommandGroupBase();
            base.addChecks((ctx) => false);
            base.addCommand("test", () => { executed = true; });
            base.invoke(fakeContext(), new StringView("test"));

            expect(executed).to.be.false;
        });

        it("navigates groups", () => {
            var executed = false;
            var base = new CommandGroupBase();
            var group = base.addGroup("group");
            group.addCommand("test", () => { executed = true; });
            base.invoke(fakeContext(), new StringView("group test"));

            expect(executed).to.be.true;
        })
    })
});