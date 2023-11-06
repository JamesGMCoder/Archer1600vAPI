const axios = require('axios');
const rsaEncrypt = require('../tools/encrypt');

module.exports = authentication;

var _RouterURI = "";

async function getModulusExponent(){
  var url = `${_RouterURI}/cgi/getParm`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
      'Referer': `${_RouterURI}/`
    }
  });

  if (response.ok) {
    data = await response.text();

    const nnRegex = /var nn="([^"]+)";/;
    const eeRegex = /var ee="([^"]+)";/;
    
    const nnMatch = data.match(nnRegex);
    const eeMatch = data.match(eeRegex);
    
    const jsonData = {};
    
    if (nnMatch && nnMatch[1]) {
      jsonData.modulus = nnMatch[1];
    } else {
      throw new Error("modulus not returned")
    }
    
    if (eeMatch && eeMatch[1]) {
      jsonData.exponent = eeMatch[1];
    } else {
      throw new Error("exponent not returned")
    }

    return jsonData;
  }
}

function authentication(url){
    _RouterURI = url;
    tokenId = "";
    cookieId = "";
 
    this.cookieId = function(){
      return cookieId;
    }
  
    this.tokenId = function(){
      return tokenId;
    }

    this.authenticate = async function(username, password){
        try {
            // We need to Get Modulus and Exponent provided from the Router as the Modulus can change.
            securityKeys = await getModulusExponent();
            
            cookieId = "";
            usernameEncrypted = rsaEncrypt(username, securityKeys.modulus, securityKeys.exponent);
            base64Password = Buffer.from(password).toString('base64');
            passwordEncrypted = rsaEncrypt(base64Password, securityKeys.modulus, securityKeys.exponent);

            var url = `${_RouterURI}/cgi/login?UserName=${usernameEncrypted}&Passwd=${passwordEncrypted}&Action=1&LoginStatus=0`;

            const response = await fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'text/plain',
                'Referer': `${_RouterURI}/`,
                'Sec-Gpc': '1'
              }
            });

            if (response.ok) {
              const cookieData = response.headers.get('Set-Cookie');
              if (cookieData == undefined){
                throw new Error('Cookie Data Empty');
              }

              // Extract the substring up to the first semicolon
              var semicolonIndex = cookieData.indexOf(';');
              cookieId = semicolonIndex !== -1 ? cookieData.substring(0, semicolonIndex) : cookieData;
              if (cookieId == "JSESSIONID=deleted"){
                this.cookieId = "";
                throw new Error('Cookie Deleted');
              }

            } else {
              throw new Error(`Failed to fetch data. Status: ${response.status}`);
            }
          } catch (error) {
            console.log('catch')
            throw error;
          }
    }

    this.getToken = async function(){
      try {
          const response = await fetch(_RouterURI, {
            method: 'GET',
            headers: {
              'Accept': 'text /html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
              'Referer': `${_RouterURI}/`,
              'Cookie': cookieId,
              'Sec-Gpc': '1',
              'Upgrade-Insecure-Requests': '1',
              'User-Agent': 'Mozilla /5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36'
            }
          });

          if (response.ok) {
            const html = await response.text();
            var tokenStart = html.indexOf('var token="');
            
            if (tokenStart !== -1) {
              tokenStart += 11;
              var tokenEnd = html.indexOf('"', tokenStart);
              
              if (tokenEnd !== -1) {
                // Extract the token
                tokenId = html.substring(tokenStart, tokenEnd);
                console.log('Token:', tokenId);
              }
            }

            console.log('ok')
          } else {
            console.log('error')
            throw new Error(`Failed to fetch data. Status: ${response.status}`);
          }
        } catch (error) {
          console.log('catch')
          throw error;
        }
  }    
}

