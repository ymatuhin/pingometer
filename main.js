// Modules to control application life and create native browser window
const { app, Tray, Menu, nativeImage } = require("electron");
var netPing = require("net-ping");
const fs = require("fs");

let tray = null;
let url = getPingUrl();

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  if (app.dock) app.dock.hide();

  const icon = nativeImage.createFromPath("./transparent.png");
  tray = new Tray(icon);
  tray.setTitle("∞");

  const contextMenu = Menu.buildFromTemplate([
    // {
    //   label: "Hello!",
    //   click() {
    //     dialog.showMessageBoxSync({ title: "132" });
    //   },
    // },
    { role: "quit" },
  ]);
  tray.setContextMenu(contextMenu);

  runPing(runDisplay);
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

let results = [];

async function runPing(callback) {
  const result = await ping();
  results = [result, ...results].slice(0, 20);
  if (callback) callback();
  setTimeout(runPing, 100);
}

function runDisplay() {
  const lost = results.filter((result) => result === null).length;
  const safeResults = results.filter(Number.isInteger);
  const sum = safeResults.reduce((a, b) => a + b, 0);
  const avg = Math.round(sum / safeResults.length);
  const delta = Math.round(Math.max(...safeResults) - Math.min(...safeResults) / 2);

  if (lost) {
    tray.setTitle("offline");
  } else {
    const lostStr = lost > 0 ? `${lost}% ` : "";
    tray.setTitle(`${lostStr}${avg}ms Δ${delta}ms`);
  }

  setTimeout(runDisplay, 2000);
}

function getPingUrl() {
  try {
    if (fs.existsSync(path)) {
      const url = fs.readFileSync("~/.ping-ping-ping") || "1.1.1.1";
      return url;
    }
  } catch (err) {
    return "1.1.1.1";
  }
}

const session = netPing.createSession({ packetSize: 64 });
function ping() {
  return new Promise((resolve) => {
    session.pingHost(url, (error, _, sent, rcvd) => resolve(error ? null : rcvd - sent));
  });
}
