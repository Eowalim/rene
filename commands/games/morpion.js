const { SALON_GAMES } = require("../../config.js");

module.exports.help = {
    name: "morpion",
    description: "Permet de jouer au morpion.",
    category: "games",
    onlyChannel: true,
    channel: SALON_GAMES,
    args: true,
    usage: "@user",
    usePerm: false,
    permission: "",
};

module.exports.run = (client, message) => {

    const player1 = message.author;
    const player2 = message.mentions.users.first();

    if (player1 === player2){
        message.channel.send(`${player1} tu ne peux pas jouer contre toi même.`);
    }
    else if(player2.bot){
        message.channel.send(`${player1} tu ne peux pas contre un bot.`)
    }
    else {
        message.channel.send(`- Une partie de morpion entre ${player1}(❌) et ${player2}(⭕) vient de commencer.\n- :information_source: Pour information la partie dure 3 minutes, si au bout de ce temps personne n'a gagné ou que vous êtes AFK celle ci sera automatiquement arrêtée.`)

        const emoji = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];

        var grille = [ ["◻", "◻", "◻"],
            ["◻", "◻", "◻"],
            ["◻", "◻", "◻"]
        ]

        var grid = editGrid();
        var map = getMap(emoji, grille);
        const filter = createFilter();

        var actualPlayer = player1;
        var msgPlay = message.channel.send(`- 🔄 ${actualPlayer}**, c'est à toi de jouer.**`);

        message.channel.send(grid).then(msg =>{
            for (let i = 0; i < emoji.length; i++){
                msg.react(emoji[i]);
            }
            const collector = msg.createReactionCollector(filter, { time: 180000});
            collector.on('collect', (reaction, user) => {
                if (!user.bot) {
                    if(user === actualPlayer){
                        if(actualPlayer === player1) place(reaction, '❌', actualPlayer);
                        if(actualPlayer === player2) place(reaction, '⭕', actualPlayer);
                        msg.edit(editGrid());
                        map = getMap(emoji, grille);
                    }
                }
            })
        });
    }

    function win(grille) {
        // horizontal
        for (let i = 0; i < 3; i++) {
            if (grille[i][0] === grille[i][1] === grille[i][2]) {
                message.channel.send(grille[i][0]);
            }
        }

        // Vertical
        for (let i = 0; i < 3; i++) {
            if (grille[0][i] === grille[1][i] === grille[2][i]) {
                message.channel.send(grille[0][i]);
            }
        }
    }

    function getMap(emoji, grille){
        var map = new Map();
        var em = 0;
        for (let x = 0 ; x < 3; x++){
            for (let y = 0 ; y < 3; y++){
                 map.set(emoji[em], grille[x][y]);
                 em++;
            }
        }
        return map;
    }

    function nextPlayer() {
        if (actualPlayer === player1){
            actualPlayer = player2;
        } else if (actualPlayer === player2){
            actualPlayer = player1;
        }
        msgPlay.then(msg => {
            msgPlay = msg.edit(`- 🔄 ${actualPlayer}**, c'est à toi de jouer.**`);
        })
    }

    function createFilter() {
        return (reaction, user) => reaction.emoji.name === '1️⃣'
            || reaction.emoji.name === '2️⃣'
            || reaction.emoji.name === '3️⃣'
            || reaction.emoji.name === '4️⃣'
            || reaction.emoji.name === '5️⃣'
            || reaction.emoji.name === '6️⃣'
            || reaction.emoji.name === '7️⃣'
            || reaction.emoji.name === '8️⃣'
            || reaction.emoji.name === '9️⃣'
            || user === player1
            || user === player2;
    }

    function place(reaction, playerEmoji, player) {
       if(map.get(reaction.emoji.name) === '◻'){
           switch (reaction.emoji.name) {
               case '1️⃣': grille[0][0] = playerEmoji;
                   break;
               case '2️⃣': grille[0][1] = playerEmoji;
                   break;
               case '3️⃣': grille[0][2] = playerEmoji;
                   break;
               case '4️⃣': grille[1][0] = playerEmoji;
                   break;
               case '5️⃣': grille[1][1] = playerEmoji;
                   break;
               case '6️⃣': grille[1][2] = playerEmoji;
                   break;
               case '7️⃣': grille[2][0] = playerEmoji;
                   break;
               case '8️⃣': grille[2][1] = playerEmoji;
                   break;
               case '9️⃣': grille[2][2] = playerEmoji;
                   break;
           }
           win(grille);
           nextPlayer();
       } else {
           message.channel.send(`${player}, cette case est déjà utilisée.`);
       }
    }


    function editGrid() {
        var grid = "";
        grid += `${grille[0][0]}${grille[0][1]}${grille[0][2]}\n`;
        grid += `${grille[1][0]}${grille[1][1]}${grille[1][2]}\n`;
        grid += `${grille[2][0]}${grille[2][1]}${grille[2][2]}\n`;
        return grid;
    }
};
