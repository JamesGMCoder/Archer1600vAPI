"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMac = exports.validateHostname = void 0;
function validateHostname(hostname) {
    if (!hostname) {
        return false;
    }
    const regex = /^[A-Za-z0-9_-]+$/;
    return regex.test(hostname);
}
exports.validateHostname = validateHostname;
function validateMac(mac) {
    if (!mac) {
        return false;
    }
    const regex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    return regex.test(mac);
}
exports.validateMac = validateMac;
//# sourceMappingURL=validation.js.map