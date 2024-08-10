import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("listen-reaction")
  .setDescription("投稿に対するリアクションを監視します");

export async function execute(interaction: CommandInteraction) {
  await interaction.reply("リアクションを監視します");
}
