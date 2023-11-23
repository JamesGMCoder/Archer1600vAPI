module.exports = {
    validateHostname,
    validateMac,
  };

function validateHostname(hostname) {
    if (hostname == undefined || hostname == null || hostname == "") {
      return false;
    }
  
    const regex = /^[A-Za-z0-9_-]+$/;
    if (!regex.test(hostname)) {
      return false;
    }
  
    return true;
  }
  
  function validateMac(mac) {
    if (mac == undefined || mac == null || mac == "") {
      return false;
    }
  
    const regex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    if (!regex.test(mac)) {
      return false;
    }
  
    return true;
  }