const { ONE_IP_REQUESTS_PER_RENDER } = require("./config");
const { getAvgFromValues } = require("./utils");

const store = {};

function addValue(ip, value) {
  store[ip] ??= [];
  const maxLength = ONE_IP_REQUESTS_PER_RENDER * 3;
  store[ip].length = Math.min(store[ip].length, maxLength);
  store[ip] = [value, ...store[ip]];
}

function getValues() {
  const values = Object.values(store);
  const filtered = values.filter((ipValues) =>
    ipValues.every((value) => value !== null),
  );
  return filtered.flat();
}

function getDelta() {
  const valuesArray = Object.values(store);
  const deltasValues = valuesArray.map(getDeltaFromValues);
  return getAvgFromValues(deltasValues);
}

function getDeltaFromValues(values) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  return Math.floor((max - min) / 2);
}

module.exports = { addValue, getValues, getDelta };
