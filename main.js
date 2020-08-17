const { Client, Collection } = require("discord.js");
const { TOKEN } = require("./config.js");
const { loadCommands, loadEvents } = require("./util/loader");

const client = new Client();
client.commands = new Collection();

console.log("Commandes chargées:");
loadCommands(client);
console.log("Events chargés:");
loadEvents(client);

client.login(TOKEN).then(() => client.user.setActivity("!help", { type: 'LISTENING'}));

