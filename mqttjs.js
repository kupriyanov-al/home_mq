console.log("TEST");
var mqtt_server = "test.mosquitto.org";
var mqtt_port = "1883";
var mqtt_destname = "";


//client = new Paho.MQTT.Client("mqtt.hostname.com", Number(8080), "", "clientId");
client = new Paho.MQTT.Client("test.mosquitto.org" ,Number(8081),"","clientId")

// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// connect the client
client.connect({onSuccess:onConnect});


// called when the client connects
function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  console.log("onConnect");
  client.subscribe("World");
  message = new Paho.MQTT.Message(JSON.stringify("Hello"));
  
  message.destinationName = "World";
  client.send(message);
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:"+responseObject.errorMessage);
    }
  }

// called when a message arrives
function onMessageArrived(message) {
    //console.log("onMessageArrived:"+message.payloadString);
    var result = message.destinationName + " : " + message.payloadString + "";
    mes = JSON.parse(message.payloadString);
    let timestamp = mes['timestamp']
    document.querySelector(".submsg").innerHTML = timestamp; 
    console.log("ddddd"+message.payloadString);
    //console.log(message.destinationName);
  }