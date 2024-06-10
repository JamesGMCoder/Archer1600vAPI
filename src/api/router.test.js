const parseRouterResponse = require('./router').parseRouterResponse;

// ROUTER TESTS
const router = require('./router').router;

describe('router api calls', () => {
  let testRouter;

  beforeEach(() => {
    testRouter = new router({ apiBaseUrl: 'mockBaseUrl', cookieId: 'mockCookieId', tokenId: 'mockTokenId' });
  });

  afterEach(() => {
    global.fetch.mockClear();
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
});

describe('parseRouterResponse', () => {
  test('Parse Valid Response', () => {
    const response = `[1,0,0,0,0,0]0\nIPAddress=192.168.1.2\naddressSource=DHCP\nleaseTimeRemaining=-1\nMACAddress=AA:C7:AA:8F:AA:AA\nhostName=TV-Num\nX_TP_ConnType=0\nactive=0\n[2,0,0,0,0,0]0\nIPAddress=192.168.1.2\naddressSource=DHCP\nleaseTimeRemaining=-1\nMACAddress=AA:3B:70:AA:D5:AA\nhostName=Laptop\nX_TP_ConnType=3\nactive=1\n[error]0\n`;

    const expectedOutput = {
      errorCode: 0,
      entries:
      [
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
    ]};
  
    let result = parseRouterResponse(response);
    expect(result).toEqual(expectedOutput);
  });

  test('No Data', () => {
    const response = ``;
    const expectedOutput = [];
    expect(parseRouterResponse(response).entries).toEqual(expectedOutput);
  });

  test('Default ErrorCode', () => {
    const response = ``;
    const expectedOutput = [];
    expect(parseRouterResponse(response).errorCode).toEqual(1);
  });

  test('Success Code Returned', () => {
    var input = '[error]0';
    var result = parseRouterResponse(input);
    expect(result.errorCode).toBe(0);
  });

  test('Error Code Returned', () => {
    var input = '[error]1001';
    var result = parseRouterResponse(input);
    expect(result.errorCode).toBe(1001);
  });
});
