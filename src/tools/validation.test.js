const { validateHostname, validateMac } = require('./validation');

describe('validateHostname', () => {
  it('should return true for a valid hostname', () => {
    expect(validateHostname('Valid_Hostname')).toBe(true);
  });

  it('should return false for an empty hostname', () => {
    expect(validateHostname('')).toBe(false);
  });

  it('should return false for an invalid hostname', () => {
    expect(validateHostname('Invalid Hostname!')).toBe(false);
  });
});

describe('validateMac', () => {
  it('should return true for a valid MAC address', () => {
    expect(validateMac('01:23:45:67:89:AB')).toBe(true);
  });

  it('should return false for an empty MAC address', () => {
    expect(validateMac('')).toBe(false);
  });

  it('should return false for an invalid MAC address', () => {
    expect(validateMac('invalid-mac')).toBe(false);
  });
});