// Make the imports
//Require a web server code
const logger = require("./src/logger");
require("./src/web/server");;
let cfg = require("./src/config");
const mqttClient = require("./src/mqtt/mqtt-client");
const handleMsg = require("./src/devices/actions");


//Handle mqtt local message
mqttClient.on("message", function (topic, message) {
    // message is Buffer
    const msg = message.toString();
    logger.debug("MQTT Message", {
        topic,
        msg
    });
    handleMsg.runAction(msg, topic, "mqtt")
        .then(data => logger.debug("mqtt done"))
        .catch(err => logger.error("mqtt failed on message: ", err));
});

logger.info("Starting Broadlink MQTT NodeJS Application");

handleMsg.scanDevice();

