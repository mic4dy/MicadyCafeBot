import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { CommandModule } from "../command_module";

const command: CommandModule = {
  data: new SlashCommandBuilder()
    .setName("listen-reaction")
    .setDescription("投稿に対するリアクションを監視します"),
  execute: async (interaction: CommandInteraction) => {
    await interaction.reply("リアクションを監視します");
  },
};

module.exports = command;
