import { Events } from "discord.js";
const event = {
    name: Events.ClientReady,
    once: true,
    execute: async (client) => {
        console.log("Bot is ready");
        if (client.user) {
            console.log(`Logged in as ${client.user.tag}`);
        }
    },
};
module.exports = event;
