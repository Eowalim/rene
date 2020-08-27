const { SALON_GAMES } = require("../../config.js");
const { MessageEmbed } = require("discord.js");

module.exports.help = {
  name: "duel",
  description: "Permet de se battre contre quelqu'un au hasard.",
  category: "games",
  onlyChannel: true,
  channel: SALON_GAMES,
  args: true,
  usage: "@utilisateur",
  usePerm: false,
  permission: "",
};

module.exports.run = (client, message) => {
  message.delete();
  const player = message.author;
  const target = message.mentions.users.first();

  if (player.equals(target)) {
    message.channel.send(
      `${message.author}, tu ne peux pas te battre toi même.`
    );
  }

  else if (target === client.user) {
    message.channel.send(`${message.author} saches que René est imbattable !`);
  }

  else {
    message.channel.send("⚔️**Duel Fight !**");

    var lifeP1 = 100, lifeP2  = 100;
    var ms1 = null, ms2 = null;
    var stopSend = false;

    var r = 0;
    var att = [], def = [], round= [];

    const task = setInterval(() => {

      if(lifeP1 <= 0 || lifeP2 <= 0){
        stopSend = true;
        clearInterval(task);
        message.channel.send(sendEmbedResume());
      } else {
        r++;
        round.push(r);

        var fight = parseInt(Math.random() * 2);
        var hit = parseInt(Math.random() * 100);

        var  par = 100;
        while (par > hit) {
          par = parseInt(Math.random() * 100);
        }

        var  hitR = hit - par;

        if (fight === 0) {
          lifeP2 = lifeP2 - hitR;
          game(player, target, lifeP1, lifeP2, hit, hitR, par);
        } else {
          lifeP1 = lifeP1 - hitR;
          game(target, player, lifeP2 , lifeP1, hit, hitR, par);
        }
      }
    }, 3000);
  }

  function game(playerAtt, playerDef, lifeAtt, lifeDef, hit, hitR, par){
    if (!stopSend) {
      if (ms1 != null && ms2 != null) {
        ms1.then((msg) => {
          ms1 = msg.edit(sendEmbedAtt(playerAtt, lifeAtt, hit));
        });
        ms2.then((msg) => {
          ms2 = msg.edit(sendEmbedDef(playerDef, lifeDef, par, hit, hitR));
        });
      } else {
        ms1 = message.channel.send(sendEmbedAtt(playerAtt, lifeAtt, hit));
        ms2 = message.channel.send(
            sendEmbedDef(playerDef, lifeDef, par, hit, hitR)
        );
      }
    }
  }
  function sendEmbedAtt(user, l1, hit) {
    att.push(user.username + ": " + `**${hit}**`);
    return new MessageEmbed()
        .setColor("#e74c3c")
        .setTitle("⚔️ Attaque")
        .setThumbnail(`${user.displayAvatarURL()}`)
        .addFields(
            {
              name: "❤️ Vie:",
              value: `${l1}/100`,
              inline: false,
            },
            {
              name: "🗡️ Infligés: ",
              value: `${hit}`,
              inline: false,
            }
        );
  }

  function sendEmbedDef(user, l2, par, hit, hitR) {
    def.push(user.username + ": " + `**${hitR}**`);
    return new MessageEmbed()
        .setColor("#3498db")
        .setTitle("🛡️ Défend")
        .setThumbnail(`${user.displayAvatarURL()}`)
        .addFields(
            {
              name: "❤️ Vie:",
              value: `${l2}/100`,
              inline: false,
            },
            {
              name: "🗡️ Subit: ",
              value: `${hit}`,
              inline: true,
            },
            {
              name: "🛡️ Bloqué: ",
              value: `${par}`,
              inline: true,
            },
            {
              name: "💔 PDV retirés: ",
              value: `${hitR}`,
              inline: true,
            }
        )
        .setFooter(`Détails: (${hit} - ${par} -> ${hitR})`);
  }

  function sendEmbedResume() {
    var winner;
    if(lifeP1 <= 0){
      winner = target.username;
    } else {
      winner = player.username;
    }


    return new MessageEmbed()
        .setColor("#FFC312")
        .setTitle("Résumé du combat")
        .addFields(
            {
              name: "Round:",
              value: `${round.join("\n")}`,
              inline: true,
            },
            {
              name: "Attaques:",
              value: `${att.join("\n")}`,
              inline: true,
            },
            {
              name: "Défenses:",
              value: `${def.join("\n")}`,
              inline: true,
            },
            {
              name: "🏆 Vainqueur:",
              value: `**${winner}**`,
              inline: false,
            }
        )
  }
};
