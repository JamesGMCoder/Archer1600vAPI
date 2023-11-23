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