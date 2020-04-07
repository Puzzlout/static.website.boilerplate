var RowParser = require("../dist/js/rowParser");
var RowParserMin = require("../dist/js/rowParser.min");
const chai = require("chai");
const should = chai.should();
const expect = chai.expect;

function testFile(RowParser) {
  describe("constructor", () => {
    it("constructor ko because absent", (done) => {
      try {
        var instance = new RowParser(undefined);
      } catch (error) {
        should.exist(error);
      }
      done();
    });
    it("constructor ko because empty", (done) => {
      try {
        var instance = new RowParser({});
      } catch (error) {
        should.exist(error);
      }
      done();
    });
    it("constructor ko because raw missing", (done) => {
      try {
        var instance = new RowParser({
          rawRow: undefined,
        });
      } catch (error) {
        should.exist(error);
      }
      done();
    });
    it("constructor ko because raw has not keys", (done) => {
      try {
        var instance = new RowParser({
          rawRow: {},
        });
      } catch (error) {
        should.exist(error);
      }
      done();
    });
    it("constructor ok - enableLog is default", (done) => {
      var instance = new RowParser({
        rawRow: { fake: "test" },
      });
      expect(instance.enableLog === false, "enableLog should false");
      done();
    });
    it("constructor ok - enableLog is good", (done) => {
      var instance = new RowParser({
        rawRow: { fake: "test" },
        enableLog: false,
      });
      expect(instance.enableLog === false, "enableLog should false");
      instance = new RowParser({
        rawRow: { fake: "test" },
        enableLog: true,
      });
      expect(instance.enableLog === true, "enableLog should true");

      done();
    });
    //check enableLog is set to default
    //check enableLog is set to input
  });
  describe("RowParse.BuildExpectedI8nColumnName", () => {
    it("Test", () => {
      should.fail();
    });
  });
}
describe("Non-minified rowParser", function () {
  testFile(RowParser);
});

// describe("Minified rowParser", function () {
//   testFile(RowParserMin);
// });
