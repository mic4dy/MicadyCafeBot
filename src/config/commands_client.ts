import { Client, Collection, SlashCommandBuilder } from "discord.js";

export class CommandsClient extends Client {
  commands: Collection<SlashCommandBuilder, Function> = new Collection();
}
