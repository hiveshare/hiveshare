var _ = require("underscore");
var when = require("when");
var request = require("request");
var url = require("url");
var http = require('http');
var express = require("express");

var dataModel = require("hiveshare-datamodel");
var dataStore = require("hiveshare-datastore");

var config = require("./config");

var Query = dataModel.Query;

module.exports = {

  start: function () {

    this.app = express();

    this.app.get("/object", _.bind(this.getObject, this));
    this.server = http.createServer(this.app);
    this.server.listen(config.localPort, "localhost");
  },

  end: function () {

    this.server.close();
  },

  getObject: function (req, res) {

    var query = new Query(req.query.q);
    var data = dataStore.getObjects(query);

    if (data) {
      res.send(data);
    } else {
      this.getRemoteObject(query).then(function (data) {
        res.send(data);
      });
    }
  },

  getRemoteObject: function (query) {

    var deferred = when.defer();

    this.url = {
      protocol: "http",
      hostname: "localhost",
      port: config.remotePort,
      pathname: "/object",
      query: {
        q: JSON.stringify({ type: {id: 1 } })
      }
    };
    request.get(url.format(this.url), function (err, res, body) {
      deferred.resolve(body);
    });

    return deferred.promise;
  }
};
