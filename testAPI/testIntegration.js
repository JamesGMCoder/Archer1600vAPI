const global = require("../src/globalState");

async function testNewApiCall() {
  try {
    const globalState = new global();
    const result = await globalState.getInterfaceConfiguration();
    console.log(result);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function getHosts() {
  try {
    const globalState = new global();
    const result = await globalState.getHosts();
    console.log(result);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function staticHostRemoveIdList(mac, ip) {
  try {
    const globalState = new global();
    const result = await globalState.staticHostRemoveIdList();
    console.log(result);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function staticHostAdd(mac, ip) {
  try {
    const globalState = new global();
    const result = await globalState.staticHostAdd(mac, ip);
    console.log(result);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function staticHostRemove(mac) {
  try {
    const globalState = new global();
    const result = await globalState.staticHostRemove(mac);
    console.log(result);
  } catch (error) {
    console.error('Error:', error);
  }
}

// testNewApiCall();
// getHosts();

// staticHostRemoveHost();
// staticHostRemoveIdList();

// try{
//   staticHostAdd("4C:66:41:AC:20:18", "192.168.1.183")
// } catch(e){
//   console.log(e);
// }

try{
  staticHostRemove("4C:66:41:AC:20:18")
} catch(e){
  console.log(e);
}

console.log("HERE END");

