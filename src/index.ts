import { Events } from "discord.js";
import dotenv from "dotenv";
import { CommandsClient } from "./config/commands_client";
import { handleCommands } from "./util/command_handler";

dotenv.config();

const client = new CommandsClient({
  intents: [],
  partials: [],
});

client.once(Events.ClientReady, () => {
  console.log("Bot is ready");
  if (client.user) {
    console.log(`Logged in as ${client.user.tag}`);
  }
});

client.commands = handleCommands();

client.login(process.env.DISCORD_TOKEN);
