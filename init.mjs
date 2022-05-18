import { promisify } from "node:util";
import tcpPingModule from "tcp-ping";
import { getDnsIps } from "./getDnsIps.mjs";

const tcpPing = promisify(tcpPingModule.ping);

const RENDER_INTERVAL = 1000;
const ONE_IP_REQUESTS_PER_RENDER = 2;
const PING_PARAMS = {
  port: 53, // DNS (domain name server) lookup
  timeout: RENDER_INTERVAL - 50,
  attempts: 1,
};

export async function init(tray) {
  const ips = await getDnsIps(PING_PARAMS.port);

  let store = {};
  ips.forEach((ip) => (store[ip] = []));

  let counter = 0;
  setInterval(async () => {
    const ip = ips[counter++ % ips.length];
    const pingData = await tcpPing({ ...PING_PARAMS, address: ip });
    const avg = pingData.avg ? Math.round(pingData.avg) : null;
    store[ip].unshift(avg);
  }, RENDER_INTERVAL / (ONE_IP_REQUESTS_PER_RENDER * ips.length));

  setInterval(() => {
    const values = Object.values(store);
    values.forEach((valuesArr) => {
      const keepCount = Math.round(ONE_IP_REQUESTS_PER_RENDER * 1.5);
      if (valuesArr.length > keepCount) valuesArr.length = keepCount;
    });
    display(store, tray);
  }, RENDER_INTERVAL);
}

function display(store, tray) {
  console.info(`🔥 store`, store);
  const trayParams = { fontType: "monospaced" }; // for padStart/padEnd
  const values = Object.values(store).flat();
  const isOffline = getIsOffline(values);

  if (isOffline) {
    tray.setTitle("offline", trayParams);
  } else {
    const title = getTrayTitle(store, values);
    const padSize = getAvgTitleLength(title) + 2; // +2 for outlier
    tray.setTitle(title.padEnd(padSize), trayParams);
  }
}

function getTrayTitle(store, values) {
  const avg = getAvgFromValues(values);
  const isAvgBig = avg > 999;
  const avgStr = isAvgBig ? "1k+" : `${avg}ms`;

  const delta = getDelta(store);
  const deltaStr = isAvgBig || delta === 0 ? "" : ` Δ${delta}ms`;

  const lostPercent = getLostPercent(values);
  const lostStr = lostPercent > 0 ? `${lostPercent}% ` : "";

  return lostStr + avgStr + deltaStr;
}

function getLostPercent(values) {
  const lost = values.filter((result) => result === null).length;
  const lostPercent = Math.round((lost / values.length) * 100);
  return lostPercent;
}

function getIsOffline(values) {
  const lostPercent = getLostPercent(values);
  return values.length === 0 || lostPercent >= 99;
}

function getDelta(store) {
  const valuesArray = Object.values(store);
  const deltasValues = valuesArray.map(getDeltaFromValues);
  return getAvgFromValues(deltasValues);
}

function getDeltaFromValues(values) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  return Math.round((max - min) / 2);
}

function getAvgFromValues(values) {
  const sum = values.reduce((a, b) => a + b, 0);
  return Math.round(sum / values.length);
}

let _avgTitleLengthStore = [];
function getAvgTitleLength(title) {
  const maxValues = RENDER_INTERVAL * 30;
  _avgTitleLengthStore = _avgTitleLengthStore.slice(0, maxValues);
  _avgTitleLengthStore.push(title.length);
  return getAvgFromValues(_avgTitleLengthStore);
}
