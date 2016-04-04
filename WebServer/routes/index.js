var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.post('/addWaypoint', function(req, res){
  var serverPassword = process.env.APIKEY;
  var userPassword = req.body.APIKEY;
  
  var waypoint = req.body.waypoint;
  var time = new Date();
  var UID = req.body.UID;

  if(serverPassword && userPassword && serverPassword === userPassword){
    Points.create({
      waypoint: waypoint,
      time: time,
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
