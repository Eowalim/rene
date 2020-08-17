const { SALON_GAMES, PREFIX, ATT } = require("../../config.js");
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

module.exports.run = (client, message, args) => {
  const player = message.author;
  const target = message.mentions.users.first();

  if (player.equals(target)) {
    message.channel.send(
      `${message.author}, tu ne peux pas te battre toi même.`
    );
  } else if (target === client.user) {
    message.channel.send(`${message.author} saches que René est imbattable !`);
  } else {
    message.channel.send("⚔️ **Duel Fight !** ");

    var lifeP1 = 100;
    var lifeP2 = 100;
    var ms1 = null;
    var ms2 = null;
    var stop = false;

    const task = setInterval(() => {
      var fight = parseInt(Math.random() * 2);
      var hit = parseInt(Math.random() * 100);

      var par = 100;
      while (par > hit) {
        par = parseInt(Math.random() * 100);
      }

      if (fight == 0) {
        hitR = hit - par;
        lifeP2 = lifeP2 - hitR;
        if (lifeP2 <= 0) {
          stop = true;
          clearInterval(task);
        }

        if (!stop) {
          if (ms1 != null && ms2 != null) {
            ms1.then((msg) => {
              ms1 = msg.edit(sendEmbedAtt(player, lifeP1, hit));
            });

            ms2.then((msg) => {
              ms2 = msg.edit(sendEmbedDef(target, lifeP2, par, hit, hitR));
            });
          } else {
            ms1 = message.channel.send(sendEmbedAtt(player, lifeP1, hit));
            ms2 = message.channel.send(
              sendEmbedDef(target, lifeP2, par, hit, hitR)
            );
          }
        }
      } else {
        hitR = hit - par;
        lifeP1 = lifeP1 - hitR;

        if (lifeP1 <= 0) {
          stop = true;
          clearInterval(task);
        }

        if (!stop) {
          if (ms1 != null && ms2 != null) {
            ms1.then((msg) => {
              ms1 = msg.edit(sendEmbedAtt(target, lifeP2, hit));
            });

            ms2.then((msg) => {
              ms2 = msg.edit(sendEmbedDef(player, lifeP1, par, hit, hitR));
            });
          } else {
            ms1 = message.channel.send(sendEmbedAtt(target, lifeP2, hit));
            ms2 = message.channel.send(
              sendEmbedDef(player, lifeP1, par, hit, hitR)
            );
          }
        }
      }
    }, 2000);
  }

  function sendEmbedAtt(user, l1, hit) {
    const embed = new MessageEmbed()
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
    return embed;

    //message.channel.send(ATT[parseInt(Math.random() * (ATT.length - 1) + 1)]);
    //message.delete();
    //message.channel.send(embed);
  }

  function sendEmbedDef(user, l2, par, hit, hitR) {
    const embed = new MessageEmbed()
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

    return embed;
    //message.delete();
    //message.channel.send(embed);
  }
};
