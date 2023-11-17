console.log("TEST");
var mqtt_server = "test.mosquitto.org";
var mqtt_port = "1883";
var mqtt_destname = "";
let temperatura = 0;
let datastamp="";

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

  client.subscribe("rasp");
  // message = new Paho.MQTT.Message(JSON.stringify("Hello"));
  
  // message.destinationName = "rasp";
  // client.send(message);
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
    console.log(mes)
    
    temperatura = mes['temperatura'];
    datastamp = mes['datastamp'];
    document.querySelector(".submsg").innerHTML = temperatura; 
    
  console.log(temperatura)  
  

  myChart.data.labels.push(datastamp);
  myChart.data.datasets[0].data.push(temperatura);
  
  console.log(myChart.data.datasets[0].data.length) 
  if (myChart.data.datasets[0].data.length > 50) {
    myChart.data.labels.shift();
    myChart.data.datasets[0].data.shift();
  }
  myChart.update();

  
 
  }



var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      data: [],
      label: "Total",
      borderColor: "#3e95cd",
      backgroundColor: "#7bb6dd",
      fill: false,
      maxTicksLimit: 10,
    }
    ]
  },
  options: {
    responsive: true,
    title: {
      display: true,
      text: 'Chart.js Line Chart'
    },
    scales: {
      xAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Time'
        },
        ticks: {
          autoSkip: true,
          // maxTicksLimit: 3,
          // max:3,
          // min:3,

          
        }
      }],
      yAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Temperature'
        },
        ticks: {
          beginAtZero: true,
          stepSize: 25,
          
        }
      }]
    }
  }
});


