var express = require('express');
var Points = require(__dirname + '/../models/Points.js');
var config = require(__dirname + '/../config.js');
var router = express.Router();
/*
 @@DNA
  Description: An express route to index. It gets all of the points in the Points database and renders
  the points in the front end.
  Input: limitFactor under req.query.limit. It limits the amount of SELECTS we do from the DB
  Output: Render the 'index' page with 'points', which comes from the database, and 'maps_api' which
  comes from config.mapsAPI.
 @@END
 */
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
    res.render('index', { points: pointsArr || {}, map_api: config.mapsAPI});
  });
});

/*
 @@DNA
 Description: An express post to '/addWaypoint'. It adds a waypoint to the Points DB. It uses an API key
 for security. The true API key is an environment variable named APIKEY.
 Input: req.body.APIKEY - User-submitted API key
        req.body.waypoint - Longitude and lattitude split by a comma
        req.body.UID - The UID for the specified trip
 Output: Point{ UID, lng, lat, time } and a success and error message
 @@END
 */
router.post('/addWaypoint', function(req, res){
  var serverPassword = process.env.APIKEY;
  var userPassword = req.body.APIKEY;

  console.log("\n\n\n");
  console.log(req.body);
  console.log("\n\n\n");

  if(!req.body.waypoint){
    return res.status(400).send({
      message: "No waypoint"
    });
  }
  if(!req.body.APIKEY){
    return res.status(400).send({
      message: "No API Key"
    });
  }
  if(!req.body.UID){
    return res.status(400).send({
      message: "No UID specified"
    });
  }
  
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
