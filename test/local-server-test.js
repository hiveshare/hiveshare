var _ = require("underscore");
var request = require("request");
var proxyquire = require("proxyquire");
var buster = require("buster");
var url = require("url");

var HiveShareDataModel = require("hiveshare-datamodel");
var HiveShareObject = HiveShareDataModel.HiveShareObject;
var Query = HiveShareDataModel.Query;

var proxyServer = function (ref, proxyData) {
  var proxyObj = {};
  _.each(proxyData, function (value, key) {
    proxyObj[key] = function () {
      return value;
    };
  });
  return proxyquire(ref, __dirname, {
    "hiveshare-datastore": proxyObj
  });
};

buster.testCase("When accessing the local server", {
  setUp: function () {
    this.url = {
      protocol: "http",
      hostname: "localhost",
      port: "8163"
    };
  },
  "list of objects": {
    setUp: function () {
      this.url.pathname = "/object";
      this.url.query = {
        q: JSON.stringify(new Query().findObjectWithTypeId(1))
      };
    },
    "when has data locally": {
      setUp: function () {
        this.server = proxyServer("../lib/local-server.js", {
          getObjects: new HiveShareObject(1).addType(1)
        });

        this.server.start();
      },
      "are retrieved locally": function (done) {
        request.get(url.format(this.url), function (err, response, body) {
          try {
            assert.equals(
              JSON.parse(body),
              new HiveShareObject(1).addType(1)
            );
          } finally {
            done();
          }
        });
      },
      tearDown: function () {
        this.server.end();
      }
    },
    "When doesn't have any data": {
      setUp: function () {
        this.server = proxyServer("../lib/local-server.js", {
          getObjects: null
        });

        this.remoteServer = proxyServer("../lib/remote-server.js", {
          getObjects: new HiveShareObject(1).addType(1)
        });

        this.server.start();
        this.remoteServer.start();
      },
      "objects are retrieved from remote server": function (done) {
        request.get(url.format(this.url), function (err, response, body) {
          try {
            assert(body);
            assert.equals(
              JSON.parse(body),
              new HiveShareObject(1).addType(1)
            );
          } finally {
            done();
          }
        });
      },
      tearDown: function () {
        this.server.end();
        this.remoteServer.end();
      }
    }
  }
});
