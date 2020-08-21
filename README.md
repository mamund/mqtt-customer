# mqtt-customers

customer management via mqtt

## The Basics
 - `customer-manager.js` owns the data
 - `customer-client.js` wants to interact w/ the data

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

 * `willWrite` : a write action will be attempted on the data store (see payload)
 * `wasCreated` : a new record was created (see payload)
 * `wasModified` : an existing record was modified (see payload)
 * `wasRemoved` : a an existing record was removed (see payload)

### Operations
Since the `customer-manager` (CM)  _owns_ the data, the CM will listen for any `willWrite` message and act according to the payload. the CM will also publish any `wasCreated`, `wasModified`, and `wasRemoved` messages as appropriate.

Clients can subscribe to `was*` events to be notified when something has changed. Clients may also publish `willWrite` messages as a way to modify the existing data store.  

### CLI
Start up each of the services:

 * `node customer-manager`
 * `node customer-listener`
 * `node customer-writer`


Then, on an open  terminal window

  mqtt sub -t 'willWrite' -h 'test.mosquitto.org' -v

On another

  mqtt pub -t 'willWrite' -h 'test.mosquitto.org' -m '{action:"create",body: {id:"123",givenName:"mike",familyName:"amund",email:"mike@example.org"}}'



 


