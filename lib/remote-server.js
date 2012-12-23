var _ = require("underscore");
var http = require('http');
var express = require("express");

var dataStore = require("hiveshare-datastore");

var config = require("./config");

module.exports = {
  start: function () {
    this.app = express();

    this.app.get("/object", _.bind(this.getObject, this));

    this.server = http.createServer(this.app);
    this.server.listen(config.remotePort, "localhost");
  },

  end: function () {
    this.server.close();
  },

  getObject: function (req, res) {
    var query = JSON.parse(req.query.q);
    var data = dataStore.getObjects(query);
    res.send(data);
  }
};

