export function getLeaseTime(leaseTimeRemaining: number): string {
  if (leaseTimeRemaining === -1) {
    return "Permanent";
  }

  const hours = Math.floor(leaseTimeRemaining / 3600);
  const minutes = Math.floor((leaseTimeRemaining % 3600) / 60);
  const seconds = leaseTimeRemaining % 60;

  return `${hours}h ${minutes}m ${seconds}s`;
}
