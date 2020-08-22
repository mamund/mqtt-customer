/* customer writer
 *
 * 2020-08 : mamund
 *
 */

// setup
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://broker.hivemq.com');

// subscribe on startup
// send out connected msg
client.on('connect', function() {
  client.subscribe('customer/connected');
  client.publish('customer/connected', 'true');
});

// handle incoming
client.on('message', function(topic, message) {
  switch(topic) {
    case 'customer/connected':
      console.log('connected');
      sendWrites();
      break;
    default:
      console.log('unknown topic %s', topic);
      break;
  };
});

// send out write messages
// wait 5 before each is sent
function sendWrites() {
  var offset = 0;
  var writes = loadWrites();

  writes.forEach(function(msg) {
    setTimeout(function() {
      if(msg.action==="exit") {process.exit()};
      client.publish('customer/willWrite',JSON.stringify(msg));
      console.log('sending %s',JSON.stringify(msg));
    }, 5000 + offset);
    offset += 5000;
  });  
};

// load up writes
function loadWrites() {
  var w=[]

  w.push({action:"create",body:{id:"123",givenName:"mork"}});
  w.push({action:"modify",body:{id:"123",givenName:"mock"}});
  w.push({action:"remove",body:{id:"123",givenName:"mock"}});
  w.push({action:"create",body:{id:"456",givenName:"murk"}});
  w.push({action:"modify",body:{id:"456",givenName:"mauk"}});
  w.push({action:"remove",body:{id:"456",givenName:"mauk"}});
  w.push({action:"exit",body:{}});

  return w;
};


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
 */
