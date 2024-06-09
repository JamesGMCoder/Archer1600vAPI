const parseRouterResponse = require('./router').parseRouterResponse;

test('parseRouterResponse addBlackList', () => {
    var input = '[197,0,0,0,0,0]0\ntype=1\nentryName=OPPP_Phone_ACL\nmac=52:93:DF:18:97:DE\nisParentCtrl=0\n[170,0,0,0,0,0]1\nisParentCtrl=0\nruleName=OPPP_Phone_ACL\ninternalHostRef=OPPP_Phone_ACL\nexternalHostRef=\nscheduleRef=\naction=1\nenable=1\n[error]0';
    var result = parseRouterResponse(input);
    expect(result[2].id).toBe("0");
});

// ROUTER TESTS
const router = require('./router').router;

describe('router', () => {
  let testRouter;

  beforeEach(() => {
    testRouter = new router({ apiBaseUrl: 'mockBaseUrl', cookieId: 'mockCookieId', tokenId: 'mockTokenId' });
  });

  afterEach(() => {
    global.fetch.mockClear();
  });

  
  test('isSessionAlive should return true', async () => {

    global.fetch = jest.fn(() =>
      Promise.resolve({
      ok: true,
      text: () => Promise.resolve('[cgi]0\n[error]0'),
    }));

    const result = await testRouter.isSessionAlive();
    expect(result).toBe(true);
  });

  test('isSessionAlive should return false', async () => {

    global.fetch = jest.fn(() =>
      Promise.resolve({
      ok: true,
      text: () => Promise.resolve('[cgi]0'),
    }));

    const result = await testRouter.isSessionAlive();
    expect(result).toBe(false);
  });

  test('getAllHosts', async () => {

    global.fetch = jest.fn(() =>
      Promise.resolve({
      ok: true,
      text: () => Promise.resolve(`[1,0,0,0,0,0]0
IPAddress=192.168.1.1
addressSource=DHCP
leaseTimeRemaining=-1
MACAddress=F8:B1:56:C1:22:11
hostName=Host1
X_TP_ConnType=0
active=1
[2,0,0,0,0,0]0
IPAddress=192.168.1.2
addressSource=DHCP
leaseTimeRemaining=-1
MACAddress=52:93:DF:18:22:11
hostName=Host2
X_TP_ConnType=3
active=1
[3,0,0,0,0,0]0
IPAddress=192.168.1.3
addressSource=DHCP
leaseTimeRemaining=-1
MACAddress=D8:BB:C1:DD:22:11
hostName=Host3
X_TP_ConnType=0
active=1
[error]0`),
    }));

    const result = await testRouter.getAllHosts();

    expect(result[0].MACAddress == "F8:B1:56:C1:22:11").toBe(true);
    expect(result[1].MACAddress == "52:93:DF:18:22:11").toBe(true);
    expect(result[2].MACAddress == "D8:BB:C1:DD:22:11").toBe(true);
  });  
});




describe('parseRouterResponse', () => {
  test('Basic Input', () => {
    const response = `
    [1,0,0,0,0,0]0
    IPAddress=192.168.1.2
    addressSource=DHCP
    leaseTimeRemaining=-1
    MACAddress=AA:C7:AA:8F:AA:AA
    hostName=TV-Num
    X_TP_ConnType=0
    active=0
    [2,0,0,0,0,0]0
    IPAddress=192.168.1.2
    addressSource=DHCP
    leaseTimeRemaining=-1
    MACAddress=AA:3B:70:AA:D5:AA
    hostName=Laptop
    X_TP_ConnType=3
    active=1
    [error]0
    `;

    const expectedOutput = [
      {
        idFull: "[1,0,0,0,0,0]0",
        id: "1",
        IPAddress: "192.168.1.2",
        addressSource: "DHCP",
        leaseTimeRemaining: -1,
        MACAddress: "AA:C7:AA:8F:AA:AA",
        hostName: "TV-Num",
        X_TP_ConnType: 0,
        active: 0
      },
      {
        idFull: "[2,0,0,0,0,0]0",
        id: "2",
        IPAddress: "192.168.1.2",
        addressSource: "DHCP",
        leaseTimeRemaining: -1,
        MACAddress: "AA:3B:70:AA:D5:AA",
        hostName: "Laptop",
        X_TP_ConnType: 3,
        active: 1
      }
    ];

    expect(parseRouterResponse(response)).toEqual(expectedOutput);
  });

  test('Input with No Valid Entries', () => {
    const response = `
    [error]0
    `;

    const expectedOutput = [];

    expect(parseRouterResponse(response)).toEqual(expectedOutput);
  });

  test('Input with Mixed Valid and Invalid Entries', () => {
    const response = `
    [1,0,0,0,0,0]0
    IPAddress=192.168.1.2
    addressSource=DHCP
    leaseTimeRemaining=-1
    MACAddress=AA:C7:AA:8F:AA:AA
    hostName=TV-Num
    X_TP_ConnType=0
    active=0
    [invalid]
    invalidEntry=none
    `;

    const expectedOutput = [
      {
        idFull: "[1,0,0,0,0,0]0",
        id: "1",
        IPAddress: "192.168.1.2",
        addressSource: "DHCP",
        leaseTimeRemaining: -1,
        MACAddress: "AA:C7:AA:8F:AA:AA",
        hostName: "TV-Num",
        X_TP_ConnType: 0,
        active: 0
      }
    ];

    expect(parseRouterResponse(response)).toEqual(expectedOutput);
  });

  test('Input with Different Line Endings', () => {
    const response = `
    [1,0,0,0,0,0]0\r\nIPAddress=192.168.1.2\r\naddressSource=DHCP\r\nleaseTimeRemaining=-1\r\nMACAddress=AA:C7:AA:8F:AA:AA\r\nhostName=TV-Num\r\nX_TP_ConnType=0\r\nactive=0\r\n[2,0,0,0,0,0]0\r\nIPAddress=192.168.1.2\r\naddressSource=DHCP\r\nleaseTimeRemaining=-1\r\nMACAddress=AA:3B:70:AA:D5:AA\r\nhostName=Laptop\r\nX_TP_ConnType=3\r\nactive=1\r\n[error]0`;

    const expectedOutput = [
      {
        idFull: "[1,0,0,0,0,0]0",
        id: "1",
        IPAddress: "192.168.1.2",
        addressSource: "DHCP",
        leaseTimeRemaining: -1,
        MACAddress: "AA:C7:AA:8F:AA:AA",
        hostName: "TV-Num",
        X_TP_ConnType: 0,
        active: 0
      },
      {
        idFull: "[2,0,0,0,0,0]0",
        id: "2",
        IPAddress: "192.168.1.2",
        addressSource: "DHCP",
        leaseTimeRemaining: -1,
        MACAddress: "AA:3B:70:AA:D5:AA",
        hostName: "Laptop",
        X_TP_ConnType: 3,
        active: 1
      }
    ];

    expect(parseRouterResponse(response)).toEqual(expectedOutput);
  });

  test('Input with Incomplete Entry', () => {
    const response = `
    [1,0,0,0,0,0]0
    IPAddress=192.168.1.2
    addressSource=DHCP
    `;

    const expectedOutput = [
      {
        idFull: "[1,0,0,0,0,0]0",
        id: "1",
        IPAddress: "192.168.1.2",
        addressSource: "DHCP"
      }
    ];

    expect(parseRouterResponse(response)).toEqual(expectedOutput);
  });
});
