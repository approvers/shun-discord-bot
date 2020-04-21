const functionName = process.env.FUNCTION_NAME

if (!functionName || functionName === "getGrass") {
  exports.getGrass = require("./getGrass")
}
