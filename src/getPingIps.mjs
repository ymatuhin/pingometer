import { promisify } from "node:util";
import tcpPingModule from "tcp-ping";

const probe = promisify(tcpPingModule.probe);

const HOSTS = [
  "1.1.1.1", // cloudflare
  "8.8.8.8", // google
  "4.2.2.1", // level3
  "9.9.9.9", // quad9
];

export async function getPingIps(port) {
  const promises = HOSTS.map((ip) => probe(ip, port));
  const results = await Promise.allSettled(promises);
  return results
    .map((result, index) => (result.value ? HOSTS[index] : null))
    .filter(Boolean);
}
