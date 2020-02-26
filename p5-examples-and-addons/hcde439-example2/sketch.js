// this variable is initialized to hold an instance of the serialport library
var serial; 
// this variable is the name of the port used
var portName = 'COM6'
// this array holds data coming in over serial
var dataarray = []; 
// this variable sets the default x position to 0
var xPos = 0;


function setup() {
  serial = new p5.SerialPort();       // makes a new instance of the serialport library
  serial.on('list', printList);       // sets a callback function for the serialport list event
  serial.on('connected', serverConnected); // callback for connecting to the server
  serial.on('open', portOpen);        // callback for the port opening
  serial.on('data', serialEvent);     // callback for when new data arrives
  serial.on('error', serialError);    // callback for errors
  serial.on('close', portClose);      // callback for the port closing
 
  serial.list();                      // lists the serial ports
  serial.open(portName);              // opens a serial port
  createCanvas(1200, 800);            // sets the display size
  background(0x08, 0x16, 0x40);       // sets the background color
}
 
// gets the list of ports
function printList(portList) {
  // portList is an array of serial port names
  for (var i = 0; i < portList.length; i++) {
    // Displays the list the console
    print(i + " " + portList[i]);
  }
}

// call this to print that there has been a successful connection to server
function serverConnected() {
  // print statement for debugging
  print('connected to server.');
}

// call this to print that there has been a successful connection to server
function portOpen() {
  // print statement for debugging
  print('the serial port opened.')
}
 
// call if an error occurs to print out the error
function serialError(err) {
  // print statement for debugging
  print('Something went wrong with the serial port. ' + err);
}

// call if the serial port is closed to notify the user
function portClose() {
  // print statement for debugging
  print('The serial port closed.');
}

// listens for input from the serial port
function serialEvent() {
  // if there is a serial port open
  if (serial.available()) {
    var datastring = serial.readLine(); // readin some serial
    var newarray; // establish a new array to avoid overwriting the current array
    try {
      newarray = JSON.parse(datastring); // try to parse the serial
      } catch(err) {
          console.log(err); // if there is an error, log it to the console
    }
    // if the new array is in fact an object
    if (typeof(newarray) == 'object') {
      // set the current array to the newly input array
      dataarray = newarray;
    }
    // notify the user via the console
    console.log("got back " + datastring);
  } 
}

// map the input data to screen positions
function graphData(newData) {
  // map the range of the input to the window height:
  var yPos = map(newData, 0, 1023, 0, height);
  // draw the line
  line(xPos, height, xPos, height - yPos);
  // at the edge of the screen, go back to the beginning:
  if (xPos >= width) {
    // reset the x position
    xPos = 0;
    // clear the screen by resetting the background:
    background(0x08, 0x16, 0x40);
  } else {
    // pass
  }
}

// present a visualization of the input data
function draw() {
  stroke('rgba(0,255,0,0.25)'); // green
  graphData(dataarray[0]); // graphs the first value of the array (the x position)

  stroke('rgba(0,80,255,0.5)'); // blue
  graphData(dataarray[1]); // graphs the second value of the array (the y position)
  xPos++; // sets the next drawing position to be one pixel to the right of the current x position
}
