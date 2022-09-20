const path = require("node:path");

const icons = {
  gray: path.resolve(__dirname, `tray-icons/gray.png`),
  green: path.resolve(__dirname, `tray-icons/green.png`),
  yellow: path.resolve(__dirname, `tray-icons/yellow.png`),
  orange: path.resolve(__dirname, `tray-icons/orange.png`),
  red: path.resolve(__dirname, `tray-icons/red.png`),
};

module.exports = function getIcon(color) {
  return icons[color];
};
