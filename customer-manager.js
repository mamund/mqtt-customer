/* csutomer data manager */

const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://broker.hivemq.com');

var customers = [];
var connected = false;

// subscribe on startup
client.on('connect', function() {
  client.subscribe('customer/connected');
  client.subscribe('customer/willWrite');

  client.publish('customer/connected');
});

// handle incoming
// first, just echo
client.on('message', function(topic, message) {
  console.log('received message %s %s', topic, message);
});

// clean up on exit
function handleAppExit(options, err) {
  if(err) {
    console.log(err.stack);
  }

  if(options.cleanup) {
    client.publish('customer/connected', 'false');
  }

  if(options.exit) {
    process.exit();
  }
};

// reg for cleanup
process.on('exit', handleAppExit.bind(null, {cleanup:true}));
process.on('SIGNINT', handleAppExit.bind(null, {exit:true}));
process.on('uncaughtException', handleAppExit.bind(null, {exit:true}));

/*
 * EOF
*

/*
function handleGarageConnected(message) {
  console.log('garage connected state is %s', message);
  connected = (message.toString() === 'true');
};

function handleGarageState(message) {
  console.log('garage state update is %s', message);
  garageState = message;
};
*/

