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
exports.Router = void 0;
const axios_1 = __importDefault(require("axios"));
class Router {
    constructor(apiData) {
        this.apiData = apiData;
        this.axiosInstance = axios_1.default.create({
            baseURL: apiData.apiBaseUrl,
            headers: {
                'Cookie': apiData.cookieId,
                'Authorization': `Bearer ${apiData.tokenId}`
            }
        });
    }
    isSessionAlive() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.axiosInstance.get('/session');
            return response.data.alive;
        });
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.axiosInstance.post('/logout');
        });
    }
    getAllHosts() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.axiosInstance.get('/hosts');
            return response.data;
        });
    }
    getBlackListStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.axiosInstance.get('/blacklist/status');
            return response.data;
        });
    }
    getBlackList() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.axiosInstance.get('/blacklist');
            return response.data;
        });
    }
    blackListEnable() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.axiosInstance.post('/blacklist/enable');
        });
    }
    blackListDisable() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.axiosInstance.post('/blacklist/disable');
        });
    }
    blacklistAddHost(mac, hostname) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.axiosInstance.post('/blacklist/add', { mac, hostname });
        });
    }
    blacklistRemoveHost(hostId, ruleId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.axiosInstance.post('/blacklist/remove', { hostId, ruleId });
        });
    }
    setHostname(mac, hostname) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.axiosInstance.post('/hostname/set', { mac, hostname });
        });
    }
    getInterfaceConfiguration() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.axiosInstance.get('/interface/configuration');
            return response.data;
        });
    }
    staticHostAdd(mac, ip) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.axiosInstance.post('/host/static/add', { mac, ip });
        });
    }
    staticHostRemove(mac) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.axiosInstance.post('/host/static/remove', { mac });
        });
    }
}
exports.Router = Router;
//# sourceMappingURL=router.js.map