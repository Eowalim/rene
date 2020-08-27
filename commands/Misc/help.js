const { MessageEmbed } = require("discord.js");
const { SALON_BOT, PREFIX } = require("../../config.js");

module.exports.help = {
  name: "help",
  description: "Envoie la fiche du BOT.",
  category: "misc",
  onlyChannel: true,
  channel: SALON_BOT,
  args: false,
  usage: "",
  usePerm: false,
  permission: "",
};

module.exports.run = (client, message, args) => {
  const embed = new MessageEmbed()
    .setColor("#ff5252")
    .setTitle(`:pushpin: Aide ${client.user.username}`)
    .setDescription(`:round_pushpin: Préfix: **${PREFIX}**`)
    .setThumbnail(`${client.user.displayAvatarURL()}`)
    .addFields(
      {
        name: "Salon: 🤖-▎bot:",
        value: `\`${PREFIX}help\`: Donne la fiche du bot.`,
        inline: false,
      },
      {
        name: "Salon: 💬-▎tchat-avec-rene",
        value: `Tu veux discuter avec René ? Alors c'est ici, pour cela utilse 🎱 dans ton message.`,
        inline: false,
      },
      {
        name: "Salon: 🎲-▎mini-Jeux:",
        value: `\`${PREFIX}lotery\`: Permet de jouer à un jeu de hasard.\n\`${PREFIX}duel @user\`: Permet de lancer un duel entre toi et un utilisateur. \n\`${PREFIX}morpion @user\`: Permet de faire une partie de morpion contre un membre du discord.`,
        inline: false,
      },
      {
        name: "Salon: 🍺-▎taverne:",
        value: `Besoin de vous détendre après une longue journée et de discuter de tout et de rien, c'est par ici ! Vous pouvez aussi lui commander des boissons avec la carte.`,
        inline: false,
      },
      {
        name: "Salon: 😄-▎yes:",
        value: `Il réagira à votre bonne humeur 😄`,
        inline: false,
      },
      {
        name: "Salon: 😡-▎grr:",
        value: `Il réagira à votre mécontentement 😡`,
        inline: false,
      },
      {
        name: ":information_source:  Informations",
        value: `1) En cas de bug veuillez contacter Eowalim en message privé.\n2) Si vous êtes curieux, vous pouvez retorouver le code du bot [ici](https://github.com/Eowalim/Rene) :wink:.`,
        inline: false,
      }
    )
    .setFooter(`René by Eowalim (v3.0)`);

  message.channel.send(embed);
  message.delete();
};
