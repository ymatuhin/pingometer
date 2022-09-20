// const fs = require("fs");
// const path = require("path");
// const homeDir = require("os").homedir();
// const logFilePath = path.join(homeDir, ".pingometer_logs.txt");
// const logStream = fs.createWriteStream(logFilePath, { flags: "a" });

// logStream.write("\n\n#Version: 1.0\n");
// logStream.write(`#Env: ${process.env.NODE_ENV}\n`);
// logStream.write(`#Date: ${new Date().toLocaleString()}\n`);
// logStream.write("#Fields: time name value\n");

module.exports = function (name, ...args) {
  console.log(name, ...args);
  // const str = `${new Date().toLocaleTimeString()} ${name} ${args
  //   .map((arg) => JSON.stringify(arg))
  //   .join(", ")} \n`;
  // logStream.write(str);
};
