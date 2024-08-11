"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_1 = __importDefault(require("./api/authentication"));
const router_1 = require("./api/router");
const leaseTime_1 = require("./leaseTime");
class GlobalState {
    constructor() {
        this.username = process.env.ROUTER_USERNAME;
        this.password = process.env.ROUTER_PASSWORD;
        this.apiData = {
            apiBaseUrl: process.env.ROUTER_API_BASE_URL,
            cookieId: "",
            tokenId: ""
        };
        this.authenticationApi = new authentication_1.default(this.apiData.apiBaseUrl);
        this.routerApi = new router_1.Router(this.apiData);
    }
    isAuthenticated() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.routerApi.isSessionAlive())) {
                yield this.authenticationApi.authenticate(this.username, this.password);
                yield this.authenticationApi.getToken();
                this.apiData.cookieId = this.authenticationApi.getCookieId();
                this.apiData.tokenId = this.authenticationApi.getTokenId();
            }
            return true;
        });
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.routerApi.isSessionAlive();
            return yield this.routerApi.logout();
        });
    }
    getHosts() {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.isAuthenticated()) {
                const result = {
                    success: true,
                    blackListEnabled: false,
                    hosts: []
                };
                const allhosts = yield this.routerApi.getAllHosts();
                allhosts.sort((a, b) => (a.hostName > b.hostName) ? 1 : -1);
                const blackListStatus = yield this.routerApi.getBlackListStatus();
                const blackList = yield this.routerApi.getBlackList();
                if (blackListStatus && blackListStatus.length > 0) {
                    if (blackListStatus[0].enable == '1') {
                        result.blackListEnabled = true;
                    }
                }
                else {
                    throw new Error("Unable to get Blacklist Status");
                }
                const macToEntryMapping = {};
                blackList.forEach((item) => {
                    if (item.mac) {
                        macToEntryMapping[item.mac] = item;
                    }
                });
                allhosts.forEach((item) => {
                    const host = {
                        mac: item.MACAddress,
                        hostname: item.hostName,
                        ip: item.IPAddress,
                        isOnline: item.active == "1",
                        isBlackListed: false,
                        connectionType: item.active != "1" ? "-" : item.X_TP_ConnType == "0" ? "Wired" : item.X_TP_ConnType == "3" ? "Wireless 5.0" : "Wireless 2.4",
                        lease: item.leaseTimeRemaining == -1 ? "Static" : "Dynamic",
                        leaseTime: (0, leaseTime_1.getLeaseTime)(item.leaseTimeRemaining)
                    };
                    if (item.MACAddress && macToEntryMapping[item.MACAddress]) {
                        const blackListItem = macToEntryMapping[item.MACAddress];
                        host.isBlackListed = true;
                        host.blackListName = blackListItem.entryName;
                        host.blackListHostId = blackListItem.id;
                        blackList.forEach((itemb) => {
                            if (blackListItem.entryName == itemb.ruleName) {
                                host.blackListRuleId = itemb.id;
                            }
                        });
                    }
                    result.hosts.push(host);
                });
                return result;
            }
        });
    }
    blackListEnable() {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.isAuthenticated()) {
                return yield this.routerApi.blackListEnable();
            }
        });
    }
    blackListDisable() {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.isAuthenticated()) {
                return yield this.routerApi.blackListDisable();
            }
        });
    }
    blacklistAddHost(mac, hostname) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.isAuthenticated()) {
                const result = yield this.routerApi.blacklistAddHost(mac, hostname);
                this.routerApi.isSessionAlive();
                return result;
            }
        });
    }
    blacklistRemoveHost(hostId, ruleId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.isAuthenticated()) {
                const result = yield this.routerApi.blacklistRemoveHost(hostId, ruleId);
                this.routerApi.isSessionAlive();
                return result;
            }
        });
    }
    setHostname(mac, hostname) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.isAuthenticated()) {
                return yield this.routerApi.setHostname(mac, hostname);
            }
        });
    }
    getInterfaceConfiguration() {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.isAuthenticated()) {
                return yield this.routerApi.getInterfaceConfiguration();
            }
        });
    }
    staticHostAdd(mac, ip) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.isAuthenticated()) {
                return yield this.routerApi.staticHostAdd(mac, ip);
            }
        });
    }
    staticHostRemove(mac) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.isAuthenticated()) {
                return yield this.routerApi.staticHostRemove(mac);
            }
        });
    }
}
exports.default = GlobalState;
//# sourceMappingURL=globalState.js.map