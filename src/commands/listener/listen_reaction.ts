import { CommandInteraction, SlashCommandBuilder } from "discord.js";

const command = new SlashCommandBuilder()
  .setName("listen-reaction")
  .setDescription("投稿に対するリアクションを監視します");

async function execute(interaction: CommandInteraction) {
  await interaction.reply("リアクションを監視します");
}

module.exports = {
  data: command,
  execute,
};
