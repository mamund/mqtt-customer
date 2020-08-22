/* customer data manager 
 *
 * 2020-08 : mamund
 *
 */

// setup 
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://broker.hivemq.com');

// internal state
var customers = [];
var connected = false;

// subscribe on startup
client.on('connect', function() {
  client.subscribe('customer/connected');
  client.subscribe('customer/willWrite');

  client.publish('customer/connected');
});

// handle incoming
client.on('message', function(topic, message) {
  switch(topic) {
    case 'customer/willWrite':
      handleWillWrite(message);
      break;
    case 'customer/connected':
      connected = true;
      break;
    default:
      console.log('no hander for topic %s',topic);
      break;
  }
});

// handle actions
function handleWillWrite(message) {
  var msg = JSON.parse(message||{});
  var body = msg.body||{};
  var action = msg.action||"unknown";

  switch(action) {
    case 'create':
      console.log('creating %s',JSON.stringify(body));
      client.publish('customer/wasCreated',JSON.stringify(body));
      break;
    case 'modify':
      console.log('modifying %s', JSON.stringify(body));
      client.publish('customer/wasModified', JSON.stringify(body));
      break;
    case 'remove':
      console.log('removing %s', JSON.stringify(body));
      client.publish('customer/wasRemoved', JSON.stringify(body));
      break;
    default:
      console.log('action %s no recognized', action);
      break;
  }
}

// clean up on exit
function handleAppExit(options, err) {
  if(err) {console.log(err.stack);}
  if(options.cleanup) {client.publish('customer/connected', 'false');}
  if(options.exit) {process.exit();}
};

// reg for cleanup
process.on('exit', handleAppExit.bind(null, {cleanup:true}));
process.on('SIGNINT', handleAppExit.bind(null, {exit:true}));
process.on('uncaughtException', handleAppExit.bind(null, {exit:true}));

/*
 * EOF
 *
 */


