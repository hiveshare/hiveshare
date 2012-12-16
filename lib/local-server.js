var express = require("express");
//var datastore = require("datastore");

//connect to data store

//start external net interface

//start local interface

var dataStore = require("hiveshare-datastore");
var app = express();
//app.use(express.bodyParser());

app.get("/object", function (req, res) {
  var query = JSON.parse(req.query.q);
  var data = dataStore.getObjects(query);
  res.send(data);
});
module.exports = {
  start: function () {
    app.listen(8163, "localhost");
  },
  end: function () {
    app.close();
  }
};
