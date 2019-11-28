var mqttClient = require("./mqtt-client");
const logger = require("./../logger");
let cfg = require("./../config");
var mqttOptions = cfg.mqtt;

//Publish power to mqtt local
var mqttPublishPower = (power) => {
    logger.debug(`Publish Devices Power to ${mqttOptions.subscribeBasePath}-stat/airpurifier/power`);
    try {
        mqttClient.publish(`${mqttOptions.subscribeBasePath}-stat/airpurifier/power`, power.toString());
    } catch (error) {
        logger.error("Local MQTT Publish Power Failed", error);
    }
}
//Publish speed to mqtt local
var mqttPublishSpeed = (speed) => {
    logger.debug(`Publish Devices Speed to ${mqttOptions.subscribeBasePath}-stat/airpurifier/speed`);
    try {
        mqttClient.publish(`${mqttOptions.subscribeBasePath}-stat/airpurifier/speed`, speed.toString());
    } catch (error) {
        logger.error("Local MQTT Publish Speed Failed", error);
    }
}
//Publish speed to mqtt local
var mqttPublishDeviceInfos = (data) => {
    logger.debug(`Publish Devices Info to ${mqttOptions.subscribeBasePath}-stat/airpurifier/info`);
    try {
        mqttClient.publish(`${mqttOptions.subscribeBasePath}-stat/devices/info`, JSON.stringify(data));
    } catch (error) {
        logger.error("Local MQTT Publish Device Infos Failed", error);
    }
}
module.exports = {
    mqttPublishPower,
    mqttPublishSpeed,
    mqttPublishDeviceInfos
}