console.log("Initializing Spwatch server.");
var serialport = require('serialport');
var portName = '/dev/ttyUSB0';

//Database Initialization
var fs = require("fs");
var file = "sensor_data.db";
var exists = fs.existsSync(file);
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

//Flow accumulation
var d = new Date();
var p_mins = d.getMinutes();
var flow = 0;

db.serialize(function() {
  if(!exists) {
		console.log("Creating table.");
    db.run("CREATE TABLE SensorData (year INTEGER, month INTEGER, day INTEGER, hour INTEGER, minute INTEGER, value REAL)");
  }else{
		console.log("Table already exists.");
	}
});

var sp = new serialport.SerialPort(portName, {
		baudRate: 9600,
		dataBits: 8,
		parity: 'none',
		stopBits: 1,
		flowControl: false,
		parser: serialport.parsers.readline("\r\n")
});

sp.on('data', function(input) {
	//Receive data from Arduino
  var d = new Date();
  var year = d.getFullYear();
  var month = d.getMonth();
  var day = d.getDay();
  var hours = d.getHours();
  var mins = d.getMinutes();

	//console.log(input);
  flow += parseFloat(input);
  if(mins != p_mins){
    //Guardar Dato
    if(isNaN(flow)){
      flow = 0;
    }
    var stmt = db.prepare("INSERT INTO SensorData VALUES (?, ?, ?, ?, ?, ?)");
    stmt.run(year, month, day, hours, mins, flow);
    stmt.finalize();
    console.log("Add data: "+ flow);
    //Reiniciamos suma
    flow = 0;
  }
  p_mins = mins;
});
