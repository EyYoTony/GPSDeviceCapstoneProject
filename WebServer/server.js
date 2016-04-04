#!/usr/bin/env node
var app = require('./app');
var config = require('./config');
var mongoose = require("mongoose");

app.set('port', process.env.PORT || 3000);

var db = mongoose.connect(config.uri, function(err){
  if(err){
    console.error("Could not connect to MongoDB");
    console.error(err);
  }
});

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});
