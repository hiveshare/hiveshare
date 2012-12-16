var request = require("request");
var proxyquire = require("proxyquire");
var buster = require("buster");
var url = require("url");

var server = proxyquire("../lib/local-server.js", __dirname, {
  "hiveshare-datastore": {
    getObjects: function () {
      return {
        types: [{id: 1}]
      };
    }
  }
});

server.start();

buster.testCase("When accessing the local server", {
  setUp: function () {
    this.url = {
      protocol: "http",
      hostname: "localhost",
      port: "8163"
    };
  },
  "gets list of objects": function (done) {
    this.url.pathname = "/object";
    this.url.query = {
      q: JSON.stringify({ type: {id: 1 } })
    };
    console.log(url.format(this.url));
    request.get(url.format(this.url), function (err, response, body) {
      assert.equals(JSON.parse(body), {types: [{id: 1}]});
      done();
    });
  }
});
