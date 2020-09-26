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

    message.delete();

    const str = args.join(" ");
    const msg1 = str.split(`${PREFIX}pub`);
    const filter = createFilter();
    const chanStaff = client.channels.cache.get(`${SALON_STAFF}`);

    message.channel.send(`${message.author}, ta demande a bien été envoyée :). Il faut juste patienter le temps qu'elle soit traitée. *(tu recevras un MP du bot pour la réponse)*`)

    chanStaff.send(`<@&${ROLE_STAFF}>`)
    chanStaff.send(embed(message.author, msg1)).then(msg =>{
        msg.react("✅");
        msg.react("❌");
        const collector = msg.createReactionCollector(filter, { time: 604800000});

        collector.on('collect', (reaction, user) => {
            if (!user.bot) {
                if(reaction.emoji.name === '✅'){
                    chanStaff.send(`✔ **${user.username}** a accepté la pub.`);
                    message.author.send(`Ta demande de pub sur Falconia a été **acceptée** par **${user.username}**, n'oublies pas de le mentionner dans ton message ;).\n` + "```" + msg1 + "```");
                    collector.stop();
                } else if (reaction.emoji.name === '❌'){
                    chanStaff.send(`${user}`);
                    reason(message.author);
                    collector.stop();
                }
            }
        })
    });


    function reason(target) {
        const filter = creatFilterReason();
        chanStaff.send(embedReason(target.username)).then(msg =>{
            msg.react("1️⃣");
            msg.react("2️⃣");
            msg.react("3️⃣");
            msg.react("4️⃣");
            msg.react("5️⃣");

            const collector = msg.createReactionCollector(filter, { time: 300000});

            collector.on('collect', (reaction, user) => {
                if (!user.bot) {
                    let reason = "";
                    switch (reaction.emoji.name){
                        case '1️⃣': reason = "Langage trop vulgaire";
                            break;
                        case '2️⃣': reason = "Contenu NSFW";
                            break;
                        case '3️⃣': reason = "Contenu mature";
                            break;
                        case '4️⃣': reason = "Contenu illégal";
                            break;
                        case '5️⃣': reason = "Trop de demande";
                            break;
                    }
                    chanStaff.send(`❌ **${user.username}** a refusé la pub pour: **${reason}**`);
                    target.send(`Ta demande de pub sur Falconia a été **refusée** par **${user.username}** pour la raison: **${reason}**`);
                    collector.stop();
                }
            })
        })
    }

    function createFilter() {
        return (reaction, user) => reaction.emoji.name === '✅' || reaction.emoji.name === '❌';
    }

    function creatFilterReason() {
        return (reaction, user) => reaction.emoji.name === '1️⃣' ||
            reaction.emoji.name === '2️⃣' ||
            reaction.emoji.name === '3️⃣' ||
            reaction.emoji.name === '4️⃣' ||
            reaction.emoji.name === '5️⃣';
    }

    function embedReason(userame){
        return new MessageEmbed()
            .setColor("#e74c3c")
            .setTitle("Selectionne une raison")
            .setFooter(`Pub de: ${userame}`)
            .addFields(
                {
                    name: "Raisons: ",
                    value: `1️⃣-> Langage trop vulgaire\n 2️⃣-> Contenu NSFW\n 3️⃣-> Contenu mature\n 4️⃣-> Contenu illégal\n 5️⃣-> Trop de demande` ,
                    inline: false,
                }
            );
    }

    function embed(user, msg){
        return new MessageEmbed()
            .setColor("#2ecc71")
            .setTitle(`Demande de ${user.username}`)
            .addFields(
                {
                    name: "Message: ",
                    value: `${msg}` ,
                    inline: false,
                }
            );
    }
};

