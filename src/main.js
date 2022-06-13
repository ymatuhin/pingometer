// Modules to control application life and create native browser window
const { app, Tray, Menu, nativeImage } = require("electron");

app.dock.hide();
app.whenReady().then(initAppStuff);

async function initAppStuff() {
  const tray = new Tray(nativeImage.createEmpty());
  tray.setTitle("∞");

  const contextMenu = Menu.buildFromTemplate([{ role: "quit" }]);
  tray.setContextMenu(contextMenu);

  const { init } = await import("./init.mjs");
  init(tray);
}
