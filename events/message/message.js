const { PREFIX, SALON_GRR, SALON_YES, SALON_TCHAT, SALON_TAVERNE } = require("../../config");
const fs = require("fs");

//JSON files
const pathTaverne = "./files/taverne.json";
const pathTchat = "./files/tchat.json";

module.exports = (client, msg) => {
  //Reactons
  if (msg.channel.id === SALON_GRR) {
    if (!msg.author.bot) msg.react("😡");
  }

  else if (msg.channel.id === SALON_YES) {
    if (!msg.author.bot) msg.react("😄");
  }

  //Messages
  else if (msg.channel.id === SALON_TAVERNE) {
    if (!msg.author.bot) {
      const msgform = msg.content.toLowerCase();
      if (msgform.includes("carte")) {
        //TODO
      } else {
        fs.readFile(pathTaverne, (err, data) => {
          if (err) throw err;
          const tav = JSON.parse(data);
          for (let i = 0; i < tav.length; i++) {
            const re = new RegExp(tav[i].trigger);
            if (msgform.match(re)) {
              const rep = tav[i].possible_answers[parseInt(Math.random() * (tav[i].possible_answers.length - 1))];
              msg.channel.send(rep.replace("${msg.author}", msg.author));
              msg.react(tav[i].reactions);
            }
          }
        });
      }
    }
  }

  else if (msg.channel.id === SALON_TCHAT) {
    if (!msg.author.bot){
      if (msg.content.includes("🎱")) {
        fs.readFile(pathTchat, (err, data) => {
          if (err) throw err;
          const file = JSON.parse(data);
          for (let i = 0; i < file.length; i++) {
            const rep = file[i].possible_answers[parseInt(Math.random() * (file[i].possible_answers.length - 1))];
            msg.channel.send(rep);
          }
        });
      }
    }
  }


  //Commands
  if (!msg.content.startsWith(PREFIX) || msg.author.bot) return;
  const args = msg.content.slice(PREFIX.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;
  const command = client.commands.get(commandName);

  if (command.help.onlyChannel && msg.channel.id !== command.help.channel) {
    let goodChannel = "";
    msg.guild.channels.cache.forEach((chan) => {
      if (chan.id === command.help.channel) {goodChannel = chan.name;}
    });
    return msg.channel.send(`${msg.author}, la commande n'est permisse que dans le salon ${goodChannel}`);
  }

  if (command.help.usePerm && !msg.guild.member(msg.author).roles.cache.some((role) => role.id === command.help.permission)) {
    return msg.channel.send(`${msg.author}, tu n'as pas la permission requise pour exécuter cette commande !`);
  }

  if (command.help.args && !args.length) {
    let noArgsReplay = `${msg.author}, la commande est: \`${PREFIX}${command.help.name} ${command.help.usage}\``;
    return msg.channel.send(noArgsReplay);
  }
  command.run(client, msg, args);
};
