import { SlashCommandBuilder } from "discord.js";
const command = {
    data: new SlashCommandBuilder()
        .setName("listen-reaction")
        .setDescription("投稿に対するリアクションを監視します"),
    execute: async (interaction) => {
        await interaction.reply("リアクションを監視します");
    },
};
module.exports = command;
