# Archer 1600v API

This API allows for the management of hosts and blacklists on the Archer 1600v router. It provides endpoints to retrieve host information, set hostnames, and manage the blacklist functionality.

## Endpoints

### GET /getHosts

Retrieves the list of hosts.

#### Response
- `200 OK`: Returns an array of host objects.
- `500 Internal Server Error`: Returns an error message.

### GET /setHostname

Sets the hostname for a specific MAC address.

#### Query Parameters
- `mac` (string, required): The MAC address of the host.
- `hostname` (string, required): The new hostname for the host.

#### Response
- `200 OK`: Returns an object with the result of the operation.
- `400 Bad Request`: Returns an error message if the hostname or MAC is invalid.
- `500 Internal Server Error`: Returns an error message.

### GET /blacklistEnable

Enables the blacklist functionality.

#### Response
- `200 OK`: Returns an object with the result of the operation.
- `500 Internal Server Error`: Returns an error message.

### GET /blacklistDisable

Disables the blacklist functionality.

#### Response
- `200 OK`: Returns an object with the result of the operation.
- `500 Internal Server Error`: Returns an error message.

### GET /blacklistAddHost

Adds a host to the blacklist.

#### Query Parameters
- `mac` (string, required): The MAC address of the host.
- `hostname` (string, required): The hostname of the host.

#### Response
- `200 OK`: Returns an object with the result of the operation.
- `500 Internal Server Error`: Returns an error message.

### GET /blacklistRemoveHost

Removes a host from the blacklist.

#### Query Parameters
- `hostId` (string, required): The ID of the host to be removed.
- `ruleId` (string, required): The ID of the rule associated with the host.

#### Response
- `200 OK`: Returns an object with the result of the operation.
- `500 Internal Server Error`: Returns an error message.

## Error Handling

Each endpoint returns a JSON object with an `error` field if an error occurs. The structure of the error response is as follows:

```json
{
  "error": "Error message"
}
