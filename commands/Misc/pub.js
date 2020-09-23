const { MessageEmbed } = require("discord.js");
const { SALON_PUB, SALON_STAFF, ROLE_STAFF, PREFIX } = require("../../config.js");

module.exports.help = {
    name: "pub",
    description: "Faire une demande de pub.",
    category: "misc",
    onlyChannel: true,
    channel: SALON_PUB,
    args: true,
    usage: "<message>",
    usePerm: false,
    permission: "",
};

module.exports.run = (client, message, args) => {


    const str = args.join(" ");
    const msg1 = str.split(`${PREFIX}pub`);
    const filter = createFilter();
    const chanStaff  =  client.channels.cache.get(`${SALON_STAFF}`);

    message.channel.send(`${message.author}, ta demande a bien été envoyéé :). Il faut juste patienter le temps qu'elle soit traitée. *(tu recevras un MP du bot pour la réponse)*`)

    chanStaff.send(`<@&${ROLE_STAFF}> Demande de **${message.author.username}**:\n` + "```" + msg1 + "```").then(msg =>{
        msg.react("✅");
        msg.react("❌");
        const collector = msg.createReactionCollector(filter, { time: 604800000});

        collector.on('collect', (reaction, user) => {
            if (!user.bot) {
                if(reaction.emoji.name === '✅'){
                    chanStaff.send(`Pub **acceptée** par: **${user.username}**`);
                    message.author.send(`Ta demande de pub sur Falconia a été **acceptée** par **${user.username}**, n'oublies pas de le mentionner dans ton message ;).\n` + "```" + msg1 + "```");
                    collector.stop();
                } else if (reaction.emoji.name === '❌'){
                    chanStaff.send(`Pub **refusée** par: **${user.username}**`);
                    message.author.send(`Ta demande de pub sur Falconia a été **refusée** par: **${user.username}**`);
                    collector.stop();
                }
            }
        })
    });

    message.delete();

    function createFilter() {
        return (reaction, user) => reaction.emoji.name === '✅' || reaction.emoji.name === '❌';
    }
};

