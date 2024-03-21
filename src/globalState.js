var authentication = require('./api/authentication');
const router = require('./api/router').router;
fs = require('fs')

module.exports = globalState;

function globalState()
{
    username = "admin";
    password = "C3lica";

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

    this.logout = async function(){
        await routerApi.isSessionAlive(); // The Router Calls this before calling logout.
        return await routerApi.logout();
    }

    this.getHosts = async function(){
        if (await this.isAuthenticated())
        {
            result = {
                success: true,
                blackListEnabled: false,
                hosts: []
            };

            allhosts = await routerApi.getAllHosts();
            allhosts.sort((a, b) => (a.hostName > b.hostName) ? 1 : -1)

            blackListStatus = await routerApi.getBlackListStatus();
            blackList = await routerApi.getBlackList();

            if (blackListStatus && blackListStatus.length > 0){
                if (blackListStatus[0].enable == '1'){
                    result.blackListEnabled = true;
                }
            } else {
                throw new Error("Unable to get Blacklist Status");
            }
        
            const macToEntryMapping = {};

            blackList.forEach((item) => {
                if (item.mac){
                    macToEntryMapping[item.mac] = item;
                }
            });

            allhosts.forEach((item) => {
                host = {
                    mac: item.MACAddress,
                    hostname: item.hostName,
                    ip: item.IPAddress,
                    isOnline: item.active == "1",
                    isBlackListed: false,
                    connectionType: item.active != "1" ? "-" : item.X_TP_ConnType == "0" ? "Wired" : item.X_TP_ConnType == "3" ? "Wireless 5.0" : "Wireless 2.4"
                }

                if (item.MACAddress && macToEntryMapping[item.MACAddress]){
                    blackListItem = macToEntryMapping[item.MACAddress];

                    host.isBlackListed = true;
                    host.blackListName = blackListItem.entryName;
                    host.blackListHostId = blackListItem.id;

                    blackList.forEach((itemb) => {
                        if (blackListItem.entryName == itemb.ruleName){
                            host.blackListRuleId = itemb.id;
                        }
                    });
                }

                result.hosts.push(host);
            });

            //result.hosts.sort((a, b) => (a.hostName > b.hostName) ? 1 : -1)
            return result;
        }
    }

    this.blackListEnable = async function () {
        if (await this.isAuthenticated())
        {
            return await routerApi.blackListEnable();
        }        
    }

    this.blackListDisable = async function () {
        if (await this.isAuthenticated())
        {
            return await routerApi.blackListDisable();
        }   
    }

    this.blacklistAddHost = async function(mac, hostname){
        if (await this.isAuthenticated())
        {
            result = await routerApi.blacklistAddHost(mac, hostname);
            routerApi.isSessionAlive();
            return result;
        }
    }

    this.blacklistRemoveHost = async function(hostId, ruleId){
        if (await this.isAuthenticated())
        {
            result = await routerApi.blacklistRemoveHost(hostId, ruleId);
            routerApi.isSessionAlive();
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



