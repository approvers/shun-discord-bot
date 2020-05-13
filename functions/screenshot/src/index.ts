const functionName = process.env.FUNCTION_NAME

if (!functionName || functionName === "takeScreenshot") {
  exports.takeScreenshot = require("./screenshot")
}
