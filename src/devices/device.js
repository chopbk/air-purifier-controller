// from: https://raw.githubusercontent.com/lprhodes/homebridge-broadlink-rm/master/helpers/getDevice.js
const BroadlinkJS = require("./broadlink");
//const BroadlinkJS = require("./broadlink");
const broadlink = new BroadlinkJS();
const EventEmitter = require("events");
const myEmitter = new EventEmitter();
const logger = require("./../logger");
var { devices } = require("./actions");
const mqttClient = require("./../mqtt/mqtt-client");
const discoveredDevices = {};
const limit = 5;
let discovering = false;
let cfg = require("./../config");
var mqttOptions = cfg.mqtt;
const discoverDevicesLoop = (count = 0) => {
  logger.info("Discover device", count);
  discovering = true;
  if (count === 0) {
    logger.info("Discover complete, broadcast devices");
    myEmitter.emit("discoverCompleted", Object.keys(discoveredDevices).length);
    Object.keys(discoveredDevices).forEach(device => {
      myEmitter.emit("device", discoveredDevices[device]);
    });
    discovering = false;
    return;
  }

  broadlink.discover();
  count--;

  setTimeout(() => {
    discoverDevicesLoop(count);
  }, 5 * 1000);
};

const discoverDevices = (count) => {
  if (discovering) return;
  discovering = true;
  discoverDevicesLoop(count);
};
  console.log("on event power ", data);
})

broadlink.on("deviceReady", device => {
  const macAddressParts =
    device.mac.toString("hex").match(/[\s\S]{1,2}/g) || [];
  //const ipAddressParts = device.host.address.split('.');
  const macAddress = macAddressParts.join(":");
  device.host.macAddress = macAddress;
  const ipAddress = device.host.address;
  //logger.info("found device", device);
  //logger.info("Discover complete")

  if (discoveredDevices[ipAddress]) return;
  /*
    logger.info(
      `Discovered Broadlink RM device at ${device.host.macAddress} (${
        device.host.address
      })`
    );
  */

  //device.host.id = macAddressParts.join('').substring(0,4) + ipAddressParts.slice(2).join('');
  device.host.id = macAddressParts.join("");
  discoveredDevices[ipAddress] = device;
  //discoveredDevices[macAddress] = device;
  //myEmitter.emit("device", device);
});

// -------------------------------------
//            Setup Broadlink
// -------------------------------------
// a broadlink device is found

myEmitter.on("device", discoveredDevice => {
  logger.info("new device", discoverDevices);
  devices.push(discoveredDevice);
  logger.info("Broadlink Found Device", discoveredDevice.host);
  discoveredDevice.on("temperature", temperature => {
    logger.debug(`Broadlink Temperature ${temperature}`, discoveredDevice.host);
    try {
      mqttClient.publish(`${mqttOptions.subscribeBasePath}-stat/${discoveredDevice.host.id}/temperature`, temperature.toString());
    } catch (error) {
      logger.error("power publish error", error);
    }
  });
  discoveredDevice.on("power", data => {
    logger.debug(`Broadlink Power ${data}`, discoveredDevice.host);
    logger.debug(`Publish to ${mqttOptions.subscribeBasePath}-stat/${discoveredDevice.host.id}/power`);
    try {
      mqttClient.publish(`${mqttOptions.subscribeBasePath}-stat/${discoveredDevice.host.id}/power`, data.toString());
    } catch (error) {
      logger.error("energy publish error", error);
    }
  })
  /*
  // IR or RF signal found
  device.on("rawData", data => {
    logger.debug("Broadlink RAW");
    //recordSave(data);
    //recordCancel();
  });
  // RF Sweep found something
  device.on("rawRFData", temp => {
    logger.debug("Broadlink RAW RF");
    recordMode = recordModeEnum.RecordRFSignal;
  });
  // Don't really know
  device.on("rawRFData2", temp => {
    logger.debug("Broadlink RAW 2");
    recordCancel();
  });
  */
});
// after a while this is triggered
myEmitter.on("discoverCompleted", numOfDevice => {
  logger.info(`Broadlink Discovery completed. Found ${numOfDevice} items.`);
  if (numOfDevice === 0) {
    logger.error("Broadlink device is missing");
  }
});
module.exports = {
  broadlink: myEmitter,
  discoverDevices
};