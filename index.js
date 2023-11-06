const express = require("express");
const bodyParser = require("body-parser");
const rsaEncrypt = require("./tools/encrypt");

const global = require("./globalState");
const globalState = new global();

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());

app.get("/getHosts", async (req, res) => {
  try {
    var result = await globalState.getHosts();
    res.json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.get("/setHostname", async (req, res) => {
  try {
    const { mac, hostname } = req.query;

    var result = await globalState.setHostname(mac, hostname);
    res.json(result);
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
});

app.get("/blacklistAddHost", async (req, res) => {
  try {
    const { mac, hostname } = req.query;

    var result = await globalState.blacklistAddHost(mac, hostname);
    res.json(result);
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
});

app.get("/blacklistRemoveHost", async (req, res) => {
  try {
    const {hostId, ruleId  } = req.query;

    var result = await globalState.blacklistRemoveHost(hostId, ruleId);
    res.json(result);
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
