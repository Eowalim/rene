const { SERVER, LOGS } = require("../../config");

module.exports = (client) => {
  console.log(`Logged in as ${client.user.tag}!`);
};
