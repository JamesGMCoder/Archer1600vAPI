const express = require("express");
const bodyParser = require("body-parser");
const { validateHostname, validateMac } = require('../tools/validation');

const global = require("./globalState");
const globalState = new global();

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log("<- Request ->");
  console.log(req.originalUrl);
  next();
});

app.use(function responseLogger(req, res, next) {
  const originalSendFunc = res.send.bind(res);
  res.send = function (body) {
    console.log("<- Response ->");
    console.log(body); // Log the response body
    return originalSendFunc(body);
  };
  next();
});

app.get("/api/getHosts", async (req, res) => {
  try {
    var result = await globalState.getHosts();
    res.json(result);
  } catch (error) {
    return res.json({ error: error.message });
  }
});

app.get("/api/setHostname", async (req, res) => {
  try {
    const { mac, hostname } = req.query;

    if (!validateHostname(hostname) || !validateMac(mac)){
      return res.json({ success: false, error: "Invalid Hostname or Mac" });
    }

    var result = await globalState.setHostname(mac, hostname);
    res.json(result);
  } catch (error) {
    return res.json({ success: false, error: error.message });
  }
});

app.get("/api/blacklistEnable", async (req, res) => {
  try {
    var result = await globalState.blackListEnable();
    res.json(result);
  } catch (error) {
    return res.json({ success: false, error: error.message });
  }
});

app.get("/api/blacklistDisable", async (req, res) => {
  try {
    var result = await globalState.blackListDisable();
    res.json(result);
  } catch (error) {
    return res.json({ success: false, error: error.message });
  }
});

app.get("/api/blacklistAddHost", async (req, res) => {
  try {
    const { mac, hostname } = req.query;

    var result = await globalState.blacklistAddHost(mac, hostname);
    res.json(result);
  } catch (error) {
    return res.json({ success: false, error: error.message });
  }
});

app.get("/api/blacklistRemoveHost", async (req, res) => {
  try {
    const { hostId, ruleId } = req.query;

    var result = await globalState.blacklistRemoveHost(hostId, ruleId);
    res.json(result);
  } catch (error) {
    return res.json({ success: false, error: error.message });
  }
});

app.get("/api/getInterfaceConfiguration", async (req, res) => {
  try {
    const { hostId, ruleId } = req.query;

    var result = await globalState.getInterfaceConfiguration();
    res.json(result);
  } catch (error) {
    return res.json({ success: false, error: error.message });
  }
});

app.get("/api/staticHostAdd", async (req, res) => {
  try {
    const { mac, ip } = req.query;

    var result = await globalState.staticHostAdd(mac, ip);
    res.json(result);
  } catch (error) {
    return res.json({ success: false, error: error.message });
  }
});

app.get("/api/staticHostRemove", async (req, res) => {
  try {
    const { mac } = req.query;

    var result = await globalState.staticHostRemove(mac);
    res.json(result);
  } catch (error) {
    return res.json({ success: false, error: error.message });
  }
});

app.get("/api/hostPacketCounters", async (req, res) => {
  try {
    var result = await globalState.hostPacketCounters();
    res.json(result);
  } catch (error) {
    return res.json({ success: false, error: error.message });
  }
});

module.exports = app;