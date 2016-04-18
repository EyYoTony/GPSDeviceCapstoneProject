var mongoose = require('mongoose');


var PointsSchema = new mongoose.Schema({
  lng: {
    type: String,
    required: true
  },
  lat: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  UID: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Points", PointsSchema);
