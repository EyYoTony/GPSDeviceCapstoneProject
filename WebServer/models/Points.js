var mongoose = require('mongoose');


var PointsSchema = new mongoose.Schema({
  waypoint: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    required: true
  },
  UID: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Points", PointsSchema);
