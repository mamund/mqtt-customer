/* listen to change events for customers  */

const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://broker.hivemq.com');

/****
 * change events
 * wasCreated, wasModified, wasRemoved
 */

// subscribe on startup
// send out connected msg
client.on('connect', function() {
  client.subscribe('customer/connected');
  client.subscribe('customer/wasChanged');
  client.subscribe('customer/wasModified');
  client.subscribe('customer/wasRemoved');

  client.publish('customer/connected','true');
});

// handle incoming
// just echo for now
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
*/
