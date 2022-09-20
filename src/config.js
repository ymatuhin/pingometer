// Some from WIKI
// https://en.wikipedia.org/wiki/Public_recursive_name_server

const HOSTS = [
  "94.140.14.14", // AdGuard
  "185.228.168.168", // CleanBrowsing
  "1.1.1.1", // Cloudflare
  "8.8.8.8", // Google Public DNS
  "208.67.222.222", // Open DNS
  "9.9.9.9", // Quad 9
];
const RENDER_INTERVAL = 1000;
const ONE_IP_REQUESTS_PER_RENDER = 1;
const PING_PARAMS = {
  port: 53, // DNS (domain name server) lookup
  timeout: RENDER_INTERVAL - 100,
  attempts: 1,
};

module.exports = {
  HOSTS,
  RENDER_INTERVAL,
  ONE_IP_REQUESTS_PER_RENDER,
  PING_PARAMS,
};
