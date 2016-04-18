var express = require('express');
var Points = require(__dirname + '/../models/Points.js');
var config = require(__dirname + '/../config.js');
var router = express.Router();

router.get('/', function(req, res) {
  var limitFactor = req.query.limit || 100;
  Points
  .find({})
  .limit(limitFactor)
  .sort('-time')
  .exec(function(err, points){
    if(err){
      console.log(err);
      return res.status(500).send('<h1>500 Server Error</h1>');
    }
    var pointsArr = [];
    for(var i in points){
      pointsArr.push({ "time": points[i].time, "lat": points[i].lat, "lng": points[i].lng, "UID": points[i].UID });
    }
    res.render('index', { points: pointsArr || {}, map_api: config.mapsAPI, error: err });
  });
});

router.post('/addWaypoint', function(req, res){
  var serverPassword = process.env.APIKEY;
  var userPassword = req.body.APIKEY;
  
  console.log("\n\n\n");
  console.log(req.body);
  console.log("\n\n\n");
  // waypoint - -127.00123,123.2394
  // UID  - 1oi4sf712fjh

  var waypoint = req.body.waypoint;
  var lat = waypoint.split(',')[0];
  var lng = waypoint.split(',')[1];
  var time = new Date();
  var UID = req.body.UID;

  if(serverPassword && userPassword && serverPassword === userPassword){
    Points.create({
      lat: lat,
      lng: lng,
      time: time.toDateString(),
      UID: UID
    }, function(err, points){
      if(err){
        return res.status(500).send({
          error: err
        });
      }
      return res.status(200).send({
        message: "success"
      });
    });
  }
});

module.exports = router;
