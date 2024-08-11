import axios from 'axios';
var rsaEncrypt = require('../tools/encrypt');

interface SecurityKeys {
  modulus: string;
  exponent: string;
}

class Authentication {
  private _RouterURI: string;
  private tokenId: string;
  private cookieId: string;

  constructor(url: string) {
    this._RouterURI = url;
    this.tokenId = '';
    this.cookieId = '';
  }

  public getCookieId(): string {
    return this.cookieId;
  }

  public getTokenId(): string {
    return this.tokenId;
  }

  private async getModulusExponent(): Promise<SecurityKeys> {
    const url = `${this._RouterURI}/cgi/getParm`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'Referer': `${this._RouterURI}/`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data. Status: ${response.status}`);
    }

    const data = await response.text();

    const nnRegex = /var nn="([^"]+)";/;
    const eeRegex = /var ee="([^"]+)";/;

    const nnMatch = data.match(nnRegex);
    const eeMatch = data.match(eeRegex);

    const jsonData: SecurityKeys = {
      modulus: '',
      exponent: ''
    };

    if (nnMatch && nnMatch[1]) {
      jsonData.modulus = nnMatch[1];
    } else {
      throw new Error('Modulus not returned');
    }

    if (eeMatch && eeMatch[1]) {
      jsonData.exponent = eeMatch[1];
    } else {
      throw new Error('Exponent not returned');
    }

    return jsonData;
  }

  public async authenticate(username: string, password: string): Promise<void> {
    try {
      const securityKeys = await this.getModulusExponent();

      this.cookieId = '';
      const usernameEncrypted = rsaEncrypt(username, securityKeys.modulus, securityKeys.exponent);
      const base64Password = Buffer.from(password).toString('base64');
      const passwordEncrypted = rsaEncrypt(base64Password, securityKeys.modulus, securityKeys.exponent);

      const url = `${this._RouterURI}/cgi/login?UserName=${usernameEncrypted}&Passwd=${passwordEncrypted}&Action=1&LoginStatus=0`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          'Referer': `${this._RouterURI}/`,
          'Sec-Gpc': '1'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }

      const cookieData = response.headers.get('Set-Cookie');
      if (!cookieData) {
        throw new Error('Cookie Data Empty');
      }

      const semicolonIndex = cookieData.indexOf(';');
      this.cookieId = semicolonIndex !== -1 ? cookieData.substring(0, semicolonIndex) : cookieData;
      if (this.cookieId === 'JSESSIONID=deleted') {
        this.cookieId = '';
        throw new Error('Cookie Deleted');
      }
    } catch (error) {
      console.log('authenticate error:', error);
      throw error;
    }
  }

  public async getToken(): Promise<void> {
    try {
      const response = await fetch(this._RouterURI, {
        method: 'GET',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Referer': `${this._RouterURI}/`,
          'Cookie': this.cookieId,
          'Sec-Gpc': '1',
          'Upgrade-Insecure-Requests': '1',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }

      const html = await response.text();
      let tokenStart = html.indexOf('var token="');

      if (tokenStart !== -1) {
        tokenStart += 11;
        const tokenEnd = html.indexOf('"', tokenStart);

        if (tokenEnd !== -1) {
          this.tokenId = html.substring(tokenStart, tokenEnd);
          console.log('Token:', this.tokenId);
        }
      }
    } catch (error) {
      console.log('getToken error:', error);
      throw error;
    }
  }
}

export default Authentication;
