const { response } = require("express");

module.exports = {
  router,
  parseRouterResponse,
};


const _RequestNewLine = "\r\n";

function router(data) {
  const apiData = data;

  // Use Cases:
  // First Time. return false
  // Active Session return true
  // Session Expired return false
  // Login From Router Interface will terminate local Session. return false
  this.isSessionAlive = async function () {
    
    postData = "[/cgi/clearBusy#0,0,0,0,0,0#0,0,0,0,0,0]0,0" + _RequestNewLine;
    urlParams = "8";
    try {
      responseText = await apiWebRequest(apiData, urlParams, postData);
      if (responseText == "[cgi]0\n[error]0") {
        return true;
      }
    } catch (error) {
      // If error returns we want to reauthenticate.
    }

    return false;
  };

  this.logout = async function(){
      postData =
        "[/cgi/logout#0,0,0,0,0,0#0,0,0,0,0,0]0,0" +
        _RequestNewLine;
      urlParams = "8";
      await apiWebRequest(apiData, urlParams, postData);
  
      return { success: true };
    };

  this.getAllHosts = async function () {

    postData = "[LAN_HOST_ENTRY#0,0,0,0,0,0#0,0,0,0,0,0]0,0" + _RequestNewLine;
    urlParams = "5";
    responseText = await apiWebRequest(apiData, urlParams, postData);
    const data = parseRouterResponse(responseText);

    if (data.errorCode != 0){
      throw new Error("Unable to Fetch Host Data");
    }

    return data.entries;
  };

  this.getBlackListStatus = async function () {

    postData = 
      "[FIREWALL#0,0,0,0,0,0#0,0,0,0,0,0]0,1" + 
      _RequestNewLine +
      "enable" + 
      _RequestNewLine;
    urlParams = "1,5";
    responseText = await apiWebRequest(apiData, urlParams, postData);
    const data = parseRouterResponse(responseText);

    if (data.errorCode != 0){
      throw new Error("Unable to Fetch Black List Status");
    }

    return data.entries;
  };

  this.getBlackList = async function () {
    postData =
      "[INTERNAL_HOST#0,0,0,0,0,0#0,0,0,0,0,0]0,0" +
      _RequestNewLine +
      "[RULE#0,0,0,0,0,0#0,0,0,0,0,0]1,0" +
      _RequestNewLine;
    urlParams = "5&5";
    responseText = await apiWebRequest(apiData, urlParams, postData);
    const data = parseRouterResponse(responseText);

    if (data.errorCode != 0){
      throw new Error("Unable to Fetch Blacklist");
    }

    return data.entries;
  };

  this.blackListEnable = async function () {
    postData =
      "[FIREWALL#0,0,0,0,0,0#0,0,0,0,0,0]0,1" +
      _RequestNewLine +
      "enable=1" +
      _RequestNewLine + 
      "[IP6_FIREWALL#0,0,0,0,0,0#0,0,0,0,0,0]1,1" +
      _RequestNewLine +
      "enable=1" +
      _RequestNewLine;

    urlParams = "2&2";
    responseText = await apiWebRequest(apiData, urlParams, postData);

    const data = parseRouterResponse(responseText);

    if (data.errorCode != 0){
      throw new Error("Unable to Fetch Blacklist");
    }

    return data.entries;
  };

  this.blackListDisable = async function () {
    postData =
      "[FIREWALL#0,0,0,0,0,0#0,0,0,0,0,0]0,1" +
      _RequestNewLine +
      "enable=0" +
      _RequestNewLine + 
      "[IP6_FIREWALL#0,0,0,0,0,0#0,0,0,0,0,0]1,1" +
      _RequestNewLine +
      "enable=0" +
      _RequestNewLine;

    urlParams = "2&2";
    responseText = await apiWebRequest(apiData, urlParams, postData);

    if (responseText == "[error]0") {
      return { success: true };
    }

    throw new Error(`Failed to disable Blacklist. ${data.errorCode}`);
  };  

  this.setHostname = async function (mac, hostname) {

    postData =
      "[LAN_HOST_ENTRY#0,0,0,0,0,0#0,0,0,0,0,0]0,2" +
      _RequestNewLine +
      `hostName=${hostname}` +
      _RequestNewLine +
      `MACAddress=${mac}` +
      _RequestNewLine;
    urlParams = "2";
    responseText = await apiWebRequest(apiData, urlParams, postData);

    if (responseText == "[error]0") {
      return { success: true };
    }

    throw new Error(`Failed to update Hostname. ${data.errorCode}`);
  };

  this.blacklistAddHost = async function (mac, hostname) {
    hostnameACL = hostname + "_ACL"; // Convention shows the router appending this to the hostname

    postData =
      "[INTERNAL_HOST#0,0,0,0,0,0#0,0,0,0,0,0]0,4" +
      _RequestNewLine +
      "type=1" +
      _RequestNewLine +
      `entryName=${hostnameACL}` +
      _RequestNewLine +
      `mac=${mac}` +
      _RequestNewLine +
      "isParentCtrl=0" +
      _RequestNewLine +
      "[RULE#0,0,0,0,0,0#0,0,0,0,0,0]1,7" +
      _RequestNewLine +
      "isParentCtrl=0" +
      _RequestNewLine +
      `ruleName=${hostnameACL}` +
      _RequestNewLine +
      `internalHostRef=${hostnameACL}` +
      _RequestNewLine +
      "externalHostRef=" +
      _RequestNewLine +
      "scheduleRef=" +
      _RequestNewLine +
      "action=1" +
      _RequestNewLine +
      "enable=1" +
      _RequestNewLine;

    urlParams = "3&3";
    responseText = await apiWebRequest(apiData, urlParams, postData);

    if (responseText != undefined)
    {
      const data = parseRouterResponse(responseText);

      if (data.errorCode != 0){
        throw new Error(`Unable to Add Host. Error Code: ${data.errorCode}`);
      }

      const results = data.entries;

      if (results.length == 2){
        return { 
          success: true,
          blackListHostId:results[0].id,
          blackListRuleId:results[1].id
        };
      }
    }

    throw new Error("Failed to Add Host to blacklist.");
  };

  this.blacklistRemoveHost = async function (hostId, ruleId) {

    postData =
      `[RULE#${ruleId},0,0,0,0,0#0,0,0,0,0,0]0,0` +
      _RequestNewLine +
      `[INTERNAL_HOST#${hostId},0,0,0,0,0#0,0,0,0,0,0]1,0` +
      _RequestNewLine;
  
    urlParams = "4&4";
    responseText = await apiWebRequest(apiData, urlParams, postData);

    if (responseText == "[error]0") {
      return { success: true };
    }

    throw new Error(`Failed to Remove Host from Blacklist. ErrorCode: ${data.errorCode}`);
  };  
}

async function apiWebRequest(apiData, urlParams, postData) {
  try {
    apiUrl = apiData.apiBaseUrl + "/cgi?" + urlParams;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
        Cookie: apiData.cookieId,
        Tokenid: apiData.tokenId,
        "Sec-Gpc": "1",
        Referer: apiData.apiBaseUrl + "/",
      },
      body: postData,
    });

    if (response.ok) {
      return await response.text();
    } else {
      throw new Error(`Failed to fetch data. ErrorCode: ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
}

function parseRouterResponse(response) {
  const lines = response.toString().split(/\r?\n/);
  const entries = [];
  let errorCode = 1; // default error code

  let i = 0;
  while (i < lines.length) {
    if (lines[i].startsWith("[error]")) {
      const match = lines[i].match(/\[error\](\d+)/);
      if (match) {
        errorCode = Number(match[1]);
      }
      i++;
    } else if (lines[i].startsWith("[")) {
      const entry = {
        idFull: lines[i],
      };

      const match = entry.idFull.match(/(\d+)/); // Match one or more digits
      if (match) {
        entry.id = match[0];
      }
      i++;

      while (i < lines.length && lines[i] && !lines[i].startsWith("[")) {
        const [key, value] = lines[i].split("=");
        entry[key] = isNaN(value) ? value : Number(value);
        i++;
      }

      entries.push(entry);
    } else {
      i++;
    }
  }

  return {
    entries: entries,
    errorCode: errorCode,
  };
}
