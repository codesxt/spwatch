var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('../../server/sensor_data.db');

var express = require('express');
var restapi = express();


console.log("Registering endpoint: /ten_last_minutes.json");
restapi.get('/ten_last_minutes.json', function(req, res){
  //console.log("RECEIVED GET REQUEST.");
  /*
  db.get("SELECT value FROM sensordata ORDER BY year, month, day, hour, minute ASC LIMIT 10", function(err, row){
      res.json({ "data" : row.value });
  });*/
  var query = "SELECT value FROM sensordata ORDER BY year DESC, month DESC, day DESC, hour DESC, minute DESC LIMIT 10";
  var values = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  db.all(query, function(err, rows) {
    for(var i=0; i<rows.length; i++){
      //console.log(rows[i].value);
      //values.push(rows[i].value);
      values[i] = rows[i].value;
    }
    values.reverse();
    //res.json('callback('+ JSON.stringify(values) + ');');
    res.jsonp({"data": values});
  });
});

console.log("Registering endpoint: /tfour_last_hours.json");
restapi.get('/tfour_last_hours.json', function(req, res){
  //console.log("RECEIVED GET REQUEST.");
  /*
  db.get("SELECT value FROM sensordata ORDER BY year, month, day, hour, minute ASC LIMIT 10", function(err, row){
      res.json({ "data" : row.value });
  });*/
  var query = "SELECT sum(value) AS value FROM sensordata GROUP BY year, month, day, hour ORDER BY year DESC, month DESC, day DESC, hour DESC LIMIT 24";
  var values = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  db.all(query, function(err, rows) {
    for(var i=0; i<rows.length; i++){
      //console.log(rows[i].value);
      //values.push(rows[i].value);
      values[i] = rows[i].value;
    }
    values.reverse();
    //res.json('callback('+ JSON.stringify(values) + ');');
    res.jsonp({"data": values});
  });
});

console.log("Registering endpoint: /seven_last_days.json");
restapi.get('/seven_last_days.json', function(req, res){
  //console.log("RECEIVED GET REQUEST.");
  /*
  db.get("SELECT value FROM sensordata ORDER BY year, month, day, hour, minute ASC LIMIT 10", function(err, row){
      res.json({ "data" : row.value });
  });*/
  var query = "SELECT sum(value) AS value FROM sensordata GROUP BY year, month, day ORDER BY year DESC, month DESC, day DESC, hour DESC LIMIT 7";
  var values = [0, 0, 0, 0, 0, 0, 0];

  db.all(query, function(err, rows) {
    for(var i=0; i<rows.length; i++){
      //console.log(rows[i].value);
      //values.push(rows[i].value);
      values[i] = rows[i].value;
    }
    values.reverse();
    //res.json('callback('+ JSON.stringify(values) + ');');
    res.jsonp({"data": values});
  });
});

restapi.listen(3000);
