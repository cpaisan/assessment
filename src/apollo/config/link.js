module.exports = require("./mockLink");

if (window.Cypress) {
  module.exports = require("./testLink");
}
