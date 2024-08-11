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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const validation_1 = require("./tools/validation");
const globalState_1 = __importDefault(require("./globalState"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
const globalState = new globalState_1.default();
app.use((req, res, next) => {
    console.log("<- Request ->");
    console.log(req.originalUrl);
    next();
});
app.use((req, res, next) => {
    const originalSendFunc = res.send.bind(res);
    res.send = function (body) {
        console.log("<- Response ->");
        console.log(body);
        return originalSendFunc(body);
    };
    next();
});
app.get("/api/getHosts", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield globalState.getHosts();
        res.json(result);
    }
    catch (error) {
        res.json({ error: error.message });
    }
}));
app.get("/api/setHostname", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { mac, hostname } = req.query;
        if (!(0, validation_1.validateHostname)(hostname) || !(0, validation_1.validateMac)(mac)) {
            return res.json({ success: false, error: "Invalid Hostname or Mac" });
        }
        const result = yield globalState.setHostname(mac, hostname);
        res.json(result);
    }
    catch (error) {
        res.json({ success: false, error: error.message });
    }
}));
app.get("/api/blacklistEnable", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield globalState.blackListEnable();
        res.json(result);
    }
    catch (error) {
        res.json({ success: false, error: error.message });
    }
}));
app.get("/api/blacklistDisable", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield globalState.blackListDisable();
        res.json(result);
    }
    catch (error) {
        res.json({ success: false, error: error.message });
    }
}));
app.get("/api/blacklistAddHost", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { mac, hostname } = req.query;
        const result = yield globalState.blacklistAddHost(mac, hostname);
        res.json(result);
    }
    catch (error) {
        res.json({ success: false, error: error.message });
    }
}));
app.get("/api/blacklistRemoveHost", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { hostId, ruleId } = req.query;
        const result = yield globalState.blacklistRemoveHost(hostId, ruleId);
        res.json(result);
    }
    catch (error) {
        res.json({ success: false, error: error.message });
    }
}));
app.get("/api/getInterfaceConfiguration", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield globalState.getInterfaceConfiguration();
        res.json(result);
    }
    catch (error) {
        res.json({ success: false, error: error.message });
    }
}));
app.get("/api/staticHostAdd", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { mac, ip } = req.query;
        const result = yield globalState.staticHostAdd(mac, ip);
        res.json(result);
    }
    catch (error) {
        res.json({ success: false, error: error.message });
    }
}));
app.get("/api/staticHostRemove", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { mac } = req.query;
        const result = yield globalState.staticHostRemove(mac);
        res.json(result);
    }
    catch (error) {
        res.json({ success: false, error: error.message });
    }
}));
exports.default = app;
//# sourceMappingURL=app.js.map