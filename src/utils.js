const getIcon = require("./icon");

function getIconToShow(values, delta) {
  if (values.length === 0) return getIcon("gray");
  const lostPercent = getLostPercent(values);
  if (lostPercent >= 95) return getIcon("gray");
  if (delta > 80 || lostPercent > 40) return getIcon("red");
  if (delta > 40 || lostPercent > 20) return getIcon("orange");
  if (delta > 20 || lostPercent > 10) return getIcon("yellow");
  return getIcon("green");
}

function getTitleToShow(values) {
  if (values.length === 0) return "";
  const lostPercent = getLostPercent(values);
  if (lostPercent >= 95) return "";
  return getTrayTitle(values);
}

function getTrayTitle(values) {
  const avg = getAvgFromValues(values) || 1; // show at least 1ms
  const isAvgBig = avg > 999;
  const avgStr = isAvgBig ? "1k+" : `${avg}ms`;
  return avgStr;
}

function getLostPercent(values) {
  const lost = values.filter((result) => result === null).length;
  const lostPercent = Math.round((lost / values.length) * 100);
  return lostPercent;
}

function getAvgFromValues(values, rounding = "round") {
  const sum = values.reduce((a, b) => a + b, 0);
  return Math[rounding](sum / values.length);
}

module.exports = {
  getIconToShow,
  getTitleToShow,
  getAvgFromValues,
};
