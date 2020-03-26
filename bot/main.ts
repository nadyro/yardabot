import {config} from 'dotenv';
import {orderHandler} from "./orders/order-handler";
import {env} from '../env/yardabot';
import * as Discord from 'discord.js';
import {MessageAttachment, MessageEmbed} from "discord.js";
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', (msg: Discord.Message) => {
    if (msg.content[0] === '!') {
        if (msg.content === '!h') {
            msg.reply('Commands for me: \n' +
                '**!gc :** Randomly generates a regular team of 5 champions \n' +
                '**!gc10 :** Randomly generates two regular teams of 5 champions each \n' +
                '**!gc top :** Randomly generates a top laner \n' +
                '**!gc jungle :** Randomly generates a jungler \n' +
                '**!gc mid :** Randomly generates a mid laner \n' +
                '**!gc adc :** Randomly generates an ad carry \n' +
                '**!gc supp :** Randomly generates a support');
        }
        orderHandler(msg.content)
            .then(result => {
                result.forEach(res => {
                    const attachment = new MessageAttachment('http://ddragon.leagueoflegends.com/cdn/10.6.1/img/champion/' + res.image.full);
                    msg.channel.send(res.name, attachment);
                });
            })
    }
});
client.login(env.DISCORD_TOKEN);