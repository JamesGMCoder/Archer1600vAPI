function validateHostname(hostname: string): boolean {
  if (!hostname) {
    return false;
  }

  const regex = /^[A-Za-z0-9_-]+$/;
  return regex.test(hostname);
}

function validateMac(mac: string): boolean {
  if (!mac) {
    return false;
  }

  const regex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
  return regex.test(mac);
}

export { validateHostname, validateMac };
