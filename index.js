// Make the imports
const { discoverDevices } = require("./src/devices/device");
const logger = require("./src/logger");
require("./src/web/server");;
require("./src/mqtt/mqtt-client");
require("./src/aws-iot/device-connect");

logger.info("Starting Broadlink MQTT NodeJS Application");
discoverDevices();
