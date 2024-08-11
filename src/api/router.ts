import axios, { AxiosInstance } from 'axios';

interface ApiData {
  apiBaseUrl: string;
  cookieId: string;
  tokenId: string;
}

export class Router {
  private apiData: ApiData;
  private axiosInstance: AxiosInstance;

  constructor(apiData: ApiData) {
    this.apiData = apiData;
    this.axiosInstance = axios.create({
      baseURL: apiData.apiBaseUrl,
      headers: {
        'Cookie': apiData.cookieId,
        'Authorization': `Bearer ${apiData.tokenId}`
      }
    });
  }

  async isSessionAlive(): Promise<boolean> {
    const response = await this.axiosInstance.get('/session');
    return response.data.alive;
  }

  async logout(): Promise<void> {
    await this.axiosInstance.post('/logout');
  }

  async getAllHosts(): Promise<any[]> {
    const response = await this.axiosInstance.get('/hosts');
    return response.data;
  }

  async getBlackListStatus(): Promise<any[]> {
    const response = await this.axiosInstance.get('/blacklist/status');
    return response.data;
  }

  async getBlackList(): Promise<any[]> {
    const response = await this.axiosInstance.get('/blacklist');
    return response.data;
  }

  async blackListEnable(): Promise<void> {
    await this.axiosInstance.post('/blacklist/enable');
  }

  async blackListDisable(): Promise<void> {
    await this.axiosInstance.post('/blacklist/disable');
  }

  async blacklistAddHost(mac: string, hostname: string): Promise<void> {
    await this.axiosInstance.post('/blacklist/add', { mac, hostname });
  }

  async blacklistRemoveHost(hostId: string, ruleId: string): Promise<void> {
    await this.axiosInstance.post('/blacklist/remove', { hostId, ruleId });
  }

  async setHostname(mac: string, hostname: string): Promise<void> {
    await this.axiosInstance.post('/hostname/set', { mac, hostname });
  }

  async getInterfaceConfiguration(): Promise<any> {
    const response = await this.axiosInstance.get('/interface/configuration');
    return response.data;
  }

  async staticHostAdd(mac: string, ip: string): Promise<void> {
    await this.axiosInstance.post('/host/static/add', { mac, ip });
  }

  async staticHostRemove(mac: string): Promise<void> {
    await this.axiosInstance.post('/host/static/remove', { mac });
  }
}
