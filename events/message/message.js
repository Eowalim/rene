const {
  PREFIX,
  SALON_GRR,
  SALON_YES,
  SALON_TCHAT,
  SALON_TAVERNE,
} = require("../../config");

const { REPONSE } = require("../../awnser");

const fs = require("fs");
const path = "./files/taverne.json";

module.exports = (client, msg) => {
  //René reaction

  if (msg.channel.id === SALON_TAVERNE) {
    if (!msg.author.bot) {
      fs.readFile(path, (err, data) => {
        if (err) throw err;
        var objectValue = JSON.parse(data);
        var msgform = msg.content.toLowerCase();
        for (let i = 0; i < objectValue.length; i++) {
          var re = new RegExp(objectValue[i].trigger);
          if (msgform.match(re)) {
            var rep =
              objectValue[i].possible_answers[
                parseInt(
                  Math.random() * (objectValue[i].possible_answers.length - 1)
                )
              ];
            msg.channel.send(rep.replace("${msg.author}", msg.author));
            msg.react(objectValue[i].reactions);
          }
        }
      });
    }
  }

  if (msg.channel.id === SALON_GRR) {
    msg.react("😡");
  }

  if (msg.channel.id === SALON_YES) {
    msg.react("😄");
  }

  if (msg.channel.id === SALON_TCHAT) {
    if (msg.content.includes("🎱")) {
      msg.channel.send(REPONSE[parseInt(Math.random() * (REPONSE.length - 1))]);
    }
  }

  if (msg.channel.id === SALON_TAVERNE) {
    var msg1 = msg.content.toLowerCase();
    if (msg1.includes("carte")) {
    }
  }

  //Checking the command structure
  if (!msg.content.startsWith(PREFIX) || msg.author.bot) return;
  const args = msg.content.slice(PREFIX.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;
  const command = client.commands.get(commandName);

  if (command.help.onlyChannel && msg.channel.id != command.help.channel) {
    let goodChannel = "";
    msg.guild.channels.cache.forEach((chan) => {
      if (chan.id === command.help.channel) {
        goodChannel = chan.name;
      }
    });
    return msg.channel.send(
      `${msg.author}, la commande n'est permisse que dans le salon ${goodChannel}`
    );
  }

  if (
    command.help.usePerm &&
    !msg.guild
      .member(msg.author)
      .roles.cache.some((role) => role.id === command.help.permission)
  ) {
    return msg.channel.send(
      `${msg.author}, tu n'as pas la permission requise pour exécuter cette commande !`
    );
  }

  if (command.help.args && !args.length) {
    let noArgsReplay = `${msg.author}, la commande est: \`${PREFIX}${command.help.name} ${command.help.usage}\``;
    return msg.channel.send(noArgsReplay);
  }
  command.run(client, msg, args);
};
