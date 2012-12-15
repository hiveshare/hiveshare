var APIeasy = require('api-easy');
var proxyquire = require('proxyquire');

var assert = require("assert");

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

var suite = APIeasy.describe("hiveshare-object");

suite
  .discuss('When accessing the local server')
    .use('localhost', 8163)
    //.setHeader('Content-Type', 'application/json')
    .get("/object", { q: JSON.stringify({ type: {id: 1 } }) })
      .expect(200, {types: [{id: 1}]})
    ["export"](module);


