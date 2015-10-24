/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */

/*
A simple node.js application intended to read data from Analog pins on the Intel based development boards such as the Intel(R) Galileo and Edison with Arduino breakout board.

MRAA - Low Level Skeleton Library for Communication on GNU/Linux platforms
Library in C/C++ to interface with Galileo & other Intel platforms, in a structured and sane API with port nanmes/numbering that match boards & with bindings to javascript & python.

Steps for installing MRAA & UPM Library on Intel IoT Platform with IoTDevKit Linux* image
Using a ssh client: 
1. echo "src maa-upm http://iotdk.intel.com/repos/1.1/intelgalactic" > /etc/opkg/intel-iotdk.conf
2. opkg update
3. opkg upgrade

Article: https://software.intel.com/en-us/html5/articles/intel-xdk-iot-edition-nodejs-templates
*/
var mqtt = require('mqtt');
var mraa = require('mraa'); //require mraa

var org = "orgxxx";                     // <--- update!!
var type = "typexx";                  // <--- update!!
var id = "idxxxxxxxxxx";                // <--- update!!
var auth_token = "auth_tokenxxxxxxxx";  // <--- update!!

var authmethod = 'use-token-auth';      // You don't need update this parm

// create clientID and URL to connect IoT foundation
var clientId = 'd:' + org + ':' + type + ':' + id;
var mqtt_url = 'mqtt://' + org + '.messaging.internetofthings.ibmcloud.com:1883';
var credentials = { clientId: clientId, username: authmethod, password: auth_token };

// create a mqtt client
var client  = mqtt.connect(mqtt_url, credentials);

// connect and process
client.on('connect', function () {
    var pub_topic = 'iot-2/evt/status/fmt/json';    // publish a message to a topic
    var pub_message;                                // message to be published
    var sub_topic = 'iot-2/cmd/cid/fmt/json';       // topic to subscribe
    var sub_message;                                // message reached to topic subscribing

// publish message to IoT foundation
  setInterval(function(){
      pub_message = '{"d":{"Temperature":' + analogVolts() + '}}'; // publish value from light sensor
      client.publish(pub_topic, pub_message, function() {
          console.log("Message is published");
      });
  },1000);
});

var dt =new Date(); 
var B = 3975;
console.log('MRAA Version: ' + mraa.getVersion()); //write the mraa version to the console
var analogPin0 = new mraa.Aio(0); //setup access analog input Analog pin #0 (A0)

var analogVolts = function () {
    var analogValue = analogPin0.read(); //read the value of the analog pin
    console.log(analogValue); //write the value of the analog pin to the console
    var resistance = (1023 - analogValue) * 10000 / analogValue; //get the resistance of the sensor;
    var celsius_temperature = 1 / (Math.log(resistance / 10000) / B + 1 / 298.15) - 273.15;//convert to temperature via datasheet ;
    console.log(dt + "Celsius Temperature: " + celsius_temperature);
    return celsius_temperature;
};