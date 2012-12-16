var _ = require("underscore");
var request = require("request");
var proxyquire = require("proxyquire");
var buster = require("buster");
var url = require("url");

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
      this.server = proxyServer("../lib/local-server.js", {
        getObjects: {
          types: [{id: 1}]
        }
      });
  
      this.server.start();
    },
    "are retrieved": function (done) {
      this.url.pathname = "/object";
      this.url.query = {
        q: JSON.stringify({ type: {id: 1 } })
      };
      request.get(url.format(this.url), function (err, response, body) {
        try {
          assert.equals(JSON.parse(body), {types: [{id: 1}]});
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
        getObjects: {
          types: [{id: 1}]
        }
      });
  
      this.server.start();
      this.remoteServer.start();
    },
    "objects are request from remote server": function (done) {
      this.url.pathname = "/object";
      this.url.query = {
        q: JSON.stringify({ type: {id: 1 } })
      };
      request.get(url.format(this.url), function (err, response, body) {
        try {
          assert(body);
          assert.equals(JSON.parse(body), {types: [{id: 1}]});
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
});
