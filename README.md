# mqtt-customers

customer management via mqtt

## The Basics
 * `customer-manager.js` owns the data
 * `customer-listener.js` wants to be notified when data changes
 * `customer-writer.js` wants to write data (planned)

### Message ID & Format
Below is the `customer` message:

``
{
  "action" : "create|modify|remove",
  "body" : {id:"",givenName:"",familyName:"",email:""},
}
``

### Events
Below are the events for customer-manager records

 * `connected` : indicates the service is connected to the network
 * `willWrite` : a write action will be attempted on the data store (see payload)
 * `wasCreated` : a new record was created (see payload)
 * `wasModified` : an existing record was modified (see payload)
 * `wasRemoved` : a an existing record was removed (see payload)

### Operations
Since the `customer-manager` (CM)  _owns_ the data, the CM will listen for any `willWrite` message and act according to the payload. the CM will also publish any `wasCreated`, `wasModified`, and `wasRemoved` messages as appropriate.

Clients can subscribe to `was*` events to be notified when something has changed. Clients may also publish `willWrite` messages as a way to modify the existing data store.  

### CLI
Start up each of the services (in this order):

 * `npm run manager`
 * `npm run listener`
 * `npm run writer`

and watch the magic!

Also, you can use the MQTT command line interface

On an open terminal window, subscribe to the `customer/willWrite` topic:

  `mqtt sub -t 'customer/willWrite' -h 'broker.hivemq.com' -v`

On another terminal window, publish a message `willWrite` message:

  `mqtt pub -t 'customer/willWrite' -h 'broker.hivemq.com' -m '{"action":"create",body: {"id":"123","givenName":"mike"}}'`




 


