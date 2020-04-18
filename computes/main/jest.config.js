const config = require("../../jest.config")

module.exports = {
  ...config,
  collectCoverageFrom: ["<rootDir>/src/**.ts", "!<rootDir>/src/app.ts"],
}
