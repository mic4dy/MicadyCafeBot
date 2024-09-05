import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export type CommandModule = {
  data: SlashCommandBuilder;
  execute: (interaction: CommandInteraction) => Promise<void>;
};
