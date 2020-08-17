const { SALON_GAMES, PREFIX } = require("../../config.js");

module.exports.help = {
  name: "lotery",
  description: "Permet de jouer à la loterie.",
  category: "games",
  onlyChannel: true,
  channel: SALON_GAMES,
  args: false,
  usage: "",
  usePerm: false,
  permission: "",
};

module.exports.run = (client, message, args) => {
  message.delete();
  const tab = ["🔵", "🔴"];

  var one = parseInt(Math.random() * 2);
  var two = parseInt(Math.random() * 2);
  var three = parseInt(Math.random() * 2);

  message.channel.send(tab[one] + tab[two] + tab[three]);

  var tot = one + two + three;

  if (tot == 0 || tot == 3) {
    message.channel.send(`Félicitation ${message.author}, tu as gagné.`);
  }
};
