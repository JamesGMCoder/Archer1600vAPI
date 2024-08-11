"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeaseTime = void 0;
function getLeaseTime(leaseTimeRemaining) {
    if (leaseTimeRemaining === -1) {
        return "Permanent";
    }
    const hours = Math.floor(leaseTimeRemaining / 3600);
    const minutes = Math.floor((leaseTimeRemaining % 3600) / 60);
    const seconds = leaseTimeRemaining % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
}
exports.getLeaseTime = getLeaseTime;
//# sourceMappingURL=leaseTime.js.map