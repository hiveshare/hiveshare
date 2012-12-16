var express = require("express");

var dataStore = require("hiveshare-datastore");

var config = require("./config");
var app = express();
//app.use(express.bodyParser());

app.get("/object", function (req, res) {
  var query = JSON.parse(req.query.q);
  var data = dataStore.getObjects(query);
  res.send(data);
});

module.exports = {
  start: function () {
    app.listen(config.localPort, "localhost");
  },
  end: function () {
    app.close();
  }
};
