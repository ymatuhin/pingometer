// Modules to control application life and create native browser window
const { app, Tray, Menu } = require("electron");
const ping = require("ping");
const fs = require("fs");

let tray = null;
let url = getPingUrl();

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  if (app.dock) app.dock.hide();

  tray = new Tray("/Users/ym/Dev/ping/transparent.png");
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

  runPing();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
const parseNumber = (val) => Math.round(Number(val));
async function runPing() {
  const params = {
    timeout: 1,
    min_reply: 10,
    extra: ["-i", "0.2"],
  };
  let { avg, max, min, packetLoss, alive } = await ping.promise.probe(url, params);

  avg = parseNumber(avg);
  max = parseNumber(max);
  min = parseNumber(min);
  loss = parseNumber(packetLoss);

  if (alive) {
    const delta = Math.round((max - min) / 2);
    const lossStr = loss > 0 ? `${loss}% ` : "";
    const result = `${lossStr}${parseNumber(avg)}ms Δ${delta}ms`;
    tray.setTitle(result);
  } else {
    tray.setTitle("offline");
  }

  setTimeout(runPing, 200);
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
