console.log("Initializing Spwatch server.");
var serialport = require('serialport');
var portName = '/dev/tty0';
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
	console.log(input);
});
