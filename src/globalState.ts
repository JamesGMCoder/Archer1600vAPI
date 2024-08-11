import Authentication from './api/authentication';
import { Router } from './api/router';
import { getLeaseTime } from './leaseTime';

interface ApiData {
  apiBaseUrl: string;
  cookieId: string;
  tokenId: string;
}

class GlobalState {
  private username: string;
  private password: string;
  private apiData: ApiData;
  private authenticationApi: Authentication;
  private routerApi: Router;

  constructor() {
    this.username = process.env.ROUTER_USERNAME as string;
    this.password = process.env.ROUTER_PASSWORD as string;

    this.apiData = {
      apiBaseUrl: process.env.ROUTER_API_BASE_URL as string,
      cookieId: "",
      tokenId: ""
    };

    this.authenticationApi = new Authentication(this.apiData.apiBaseUrl);
    this.routerApi = new Router(this.apiData);
  }

  async isAuthenticated(): Promise<boolean> {
    if (!await this.routerApi.isSessionAlive()) {
      await this.authenticationApi.authenticate(this.username, this.password);    
      await this.authenticationApi.getToken();
      this.apiData.cookieId = this.authenticationApi.getCookieId();
      this.apiData.tokenId = this.authenticationApi.getTokenId();
    }

    return true;
  }

  async logout() {
    await this.routerApi.isSessionAlive();
    return await this.routerApi.logout();
  }

  async getHosts() {
    if (await this.isAuthenticated()) {
      const result: any = {
        success: true,
        blackListEnabled: false,
        hosts: []
      };

      const allhosts = await this.routerApi.getAllHosts();
      allhosts.sort((a: any, b: any) => (a.hostName > b.hostName) ? 1 : -1);

      const blackListStatus = await this.routerApi.getBlackListStatus();
      const blackList = await this.routerApi.getBlackList();

      if (blackListStatus && blackListStatus.length > 0) {
        if (blackListStatus[0].enable == '1') {
          result.blackListEnabled = true;
        }
      } else {
        throw new Error("Unable to get Blacklist Status");
      }

      const macToEntryMapping: { [key: string]: any } = {};

      blackList.forEach((item: any) => {
        if (item.mac) {
          macToEntryMapping[item.mac] = item;
        }
      });

      allhosts.forEach((item: any) => {
        const host: any = {
          mac: item.MACAddress,
          hostname: item.hostName,
          ip: item.IPAddress,
          isOnline: item.active == "1",
          isBlackListed: false,
          connectionType: item.active != "1" ? "-" : item.X_TP_ConnType == "0" ? "Wired" : item.X_TP_ConnType == "3" ? "Wireless 5.0" : "Wireless 2.4",
          lease: item.leaseTimeRemaining == -1 ? "Static" : "Dynamic",
          leaseTime: getLeaseTime(item.leaseTimeRemaining)
        };

        if (item.MACAddress && macToEntryMapping[item.MACAddress]) {
          const blackListItem = macToEntryMapping[item.MACAddress];

          host.isBlackListed = true;
          host.blackListName = blackListItem.entryName;
          host.blackListHostId = blackListItem.id;

          blackList.forEach((itemb: any) => {
            if (blackListItem.entryName == itemb.ruleName) {
              host.blackListRuleId = itemb.id;
            }
          });
        }

        result.hosts.push(host);
      });

      return result;
    }
  }

  async blackListEnable() {
    if (await this.isAuthenticated()) {
      return await this.routerApi.blackListEnable();
    }
  }

  async blackListDisable() {
    if (await this.isAuthenticated()) {
      return await this.routerApi.blackListDisable();
    }
  }

  async blacklistAddHost(mac: string, hostname: string) {
    if (await this.isAuthenticated()) {
      const result = await this.routerApi.blacklistAddHost(mac, hostname);
      this.routerApi.isSessionAlive();
      return result;
    }
  }

  async blacklistRemoveHost(hostId: string, ruleId: string) {
    if (await this.isAuthenticated()) {
      const result = await this.routerApi.blacklistRemoveHost(hostId, ruleId);
      this.routerApi.isSessionAlive();
      return result;
    }
  }

  async setHostname(mac: string, hostname: string) {
    if (await this.isAuthenticated()) {
      return await this.routerApi.setHostname(mac, hostname);
    }
  }

  async getInterfaceConfiguration() {
    if (await this.isAuthenticated()) {
      return await this.routerApi.getInterfaceConfiguration();
    }
  }

  async staticHostAdd(mac: string, ip: string) {
    if (await this.isAuthenticated()) {
      return await this.routerApi.staticHostAdd(mac, ip);
    }
  }

  async staticHostRemove(mac: string) {
    if (await this.isAuthenticated()) {
      return await this.routerApi.staticHostRemove(mac);
    }
  }
}

export default GlobalState;
