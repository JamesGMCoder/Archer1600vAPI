var authentication = require('./api/authentication');
const router = require('./api/router').router;
fs = require('fs')

module.exports = globalState;

function globalState()
{
    username = "admin";
    password = "XXXXXX";

    const apiData = {
        apiBaseUrl: "http://192.168.1.1",
        cookieId: "",
        tokenId: ""
    }

    const authenticationApi = new authentication(apiData.apiBaseUrl);
    const routerApi = new router(apiData);

    this.isAuthenticated = async function(){
        
        // Ping the Router with current credentials to see if still alove.
        if (!await routerApi.isSessionAlive())
        {
            // If an Error occurs while authenticating an Error is thrown.
            await authenticationApi.authenticate(username, password);    
            await authenticationApi.getToken();
            apiData.cookieId = authenticationApi.cookieId();
            apiData.tokenId = authenticationApi.tokenId();
        }

        return true;
    }

    this.getHosts = async function(){
        if (await this.isAuthenticated())
        {
            result = {
                blackListEnabled: false,
                devices: []
            };

            allDevices = await routerApi.getAllHosts();
            blackList = await  routerApi.getBlackList();

            const macToEntryMapping = {};

            blackList.forEach((item) => {
                if (item.mac){
                    macToEntryMapping[item.mac] = item;
                }
            });

            allDevices.forEach((item) => {
                device = {
                    mac: item.MACAddress,
                    host: item.hostName,
                    ip: item.IPAddress,
                    isBlackListed: false
                }

                if (item.MACAddress && macToEntryMapping[item.MACAddress]){
                    blackListItem = macToEntryMapping[item.MACAddress];

                    device.isBlackListed = true;
                    device.blackListName = blackListItem.entryName;
                    device.blackListHostId = blackListItem.id;

                    blackList.forEach((itemb) => {
                        if (blackListItem.entryName == itemb.ruleName){
                            device.blackListRuleId = itemb.id;
                        }
                    });
                }

                result.devices.push(device);
            });

            return result;
        }
    }    

    this.blacklistAddHost = async function(mac, hostname){
        if (await this.isAuthenticated())
        {
            result = await routerApi.blacklistAddHost(mac, hostname);
            return result;
        }
    }

    this.blacklistRemoveHost = async function(hostId, ruleId){
        if (await this.isAuthenticated())
        {
            result = await routerApi.blacklistRemoveHost(hostId, ruleId);
            return result;
        }            
    }    

    this.setHostname = async function(mac, hostname){
        if (await this.isAuthenticated())
        {
            return await routerApi.setHostname(mac, hostname);
        }
    }
}



