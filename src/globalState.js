var authentication = require('./api/authentication');
const router = require('./api/router').router;
const getLeaseTime = require('./leaseTime').getLeaseTime;
require('dotenv').config();

module.exports = globalState;

function globalState() {
    username = process.env.ROUTER_USERNAME;
    password = process.env.ROUTER_PASSWORD;

    const apiData = {
    apiBaseUrl: process.env.ROUTER_API_BASE_URL,
    cookieId: "",
    tokenId: ""
};

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
            await routerApi.hostPacketCounters();
            result = {
                success: true,
                blackListEnabled: false,
                hosts: []
            };

            // Gets all the hosts from the Router. 
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
                    connectionType: item.active != "1" ? "-" : item.X_TP_ConnType == "0" ? "Wired" : item.X_TP_ConnType == "3" ? "Wireless 5.0" : "Wireless 2.4",
                    lease: item.leaseTimeRemaining == -1 ? "Static" : "Dynamic",
                    leaseTime: getLeaseTime(item.leaseTimeRemaining),

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

    this.hostPacketCounters = async function(){
        if (await this.isAuthenticated())
        {
            const counters = await routerApi.hostPacketCounters();

            const mappedData = counters.map(item => ({
                mac: item.associatedDeviceMACAddress,
                sentDataCount: item.X_TP_TotalPacketsSent,
                receivedDataCount: item.X_TP_TotalPacketsReceived
            }));

            return {success: true, devices: mappedData};
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

    this.getInterfaceConfiguration = async function(){
        if (await this.isAuthenticated())
        {
            return await routerApi.getInterfaceConfiguration();
        }
    }

    this.staticHostAdd = async function(mac, ip){
        if (await this.isAuthenticated())
        {
            return await routerApi.staticHostAdd(mac, ip);
        }
    }

    this.staticHostRemove = async function(mac){
        if (await this.isAuthenticated())
        {
            /* 
                [
                {
                    idFull: "[1,1,0,0,0,0]0",
                    id: "1",
                    chaddr: "F8:B1:56:C1:A8:B5",
                },
            */            
            const listOfIdsByMac = await routerApi.staticHostRemoveIdList();
            const item = listOfIdsByMac.find(item => item.chaddr === mac);

            if (!item){
                throw new Error(`Unable to Find MAC ${mac}`);
            }

            // The top 6 numbers from idFull need to go into request
            // "[LAN_DHCP_STATIC_ADDR#1,5,0,0,0,0#0,0,0,0,0,0]0,1" 
            id = item.idFull.slice(1, -2);  // "[1,1,0,0,0,0]0" -> "1,1,0,0,0,0"

            return await routerApi.staticHostRemove(id);
        }

        this.statichostPacketCountersHostAdd = async function(mac, ip){
            if (await this.isAuthenticated())
            {
                return await routerApi.hostPacketCounters(mac, ip);
            }
        }
        hostPacketCounters
    }
}



