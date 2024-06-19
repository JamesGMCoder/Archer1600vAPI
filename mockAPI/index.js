const express = require("express");
const bodyParser = require("body-parser");

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
  return res.json(require('./mockResponses/getHosts.json'));
});

app.get("/api/setHostname", async (req, res) => {
  return res.json(require('./mockResponses/setHostname.json'));
});

app.get("/api/blacklistEnable", async (req, res) => {
  return res.json(require('./mockResponses/blacklistEnable.json'));
});

app.get("/api/blacklistDisable", async (req, res) => {
  return res.json(require('./mockResponses/blacklistDisable.json'));
});

app.get("/api/blacklistAddHost", async (req, res) => {
  return res.json(require('./mockResponses/blacklistAddHost.json'));
});

app.get("/api/blacklistRemoveHost", async (req, res) => {
  return res.json(require('./mockResponses/blacklistRemoveHost.json'));
});

app.get("/api/getInterfaceConfiguration", async (req, res) => {
  return res.json(require('./mockResponses/getInterfaceConfiguration.json'));
});

app.get("/api/staticHostAdd", async (req, res) => {
  return res.json(require('./mockResponses/staticHostAdd.json'));
});

app.get("/api/staticHostRemove", async (req, res) => {
  return require('mockResponses/setHostname.json');
});

// Start Server
const port = process.env.PORT || 3000;

const start = (port) => {
  try {
    app.listen(port, () => {
      console.log(`Api running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error(err);
    process.exit();
  }
};

start(port);