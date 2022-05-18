import { promisify } from "node:util";
import tcpPingModule from "tcp-ping";

const probe = promisify(tcpPingModule.probe);

const HOSTS = [
  "1.1.1.1", // cloudflare
  "8.8.8.8", // google
  "4.2.2.1", // level3
  "9.9.9.9", // quad9
  "77.88.8.7", // yandex
  "185.228.168.168", // cleanbrowsing
  "208.67.222.222", // opendns
];

export async function getDnsIps(port) {
  const promises = HOSTS.map((ip) => probe(ip, port));
  const results = await Promise.allSettled(promises);
  const filtered = results
    .map((result, index) => (result.value ? HOSTS[index] : null))
    .filter(Boolean);
  return filtered;
}
