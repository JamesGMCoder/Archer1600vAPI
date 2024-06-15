module.exports.getLeaseTime = function(leaseTimeRemaining) {
    if (leaseTimeRemaining === -1) {
      return "";
    }
  
    let hours = parseInt(leaseTimeRemaining / (60 * 60), 10);
    hours = hours < 10 ? '0' + hours : hours;
    let minutes = parseInt((leaseTimeRemaining / 60), 10) % 60;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let seconds = leaseTimeRemaining % 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
  
    return `${hours}:${minutes}:${seconds}`;
  };
  