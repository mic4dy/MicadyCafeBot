import { Client } from "discord.js";
import dotenv from "dotenv";
import { CommandHandler } from "./commands/command_handler";
import { EventHandler } from "./events/event_handler";

dotenv.config();

const client = new Client({
  intents: [],
  partials: [],
});

const commandHandler = new CommandHandler();
client.commands = await commandHandler.generateCollection();

const eventHandler = new EventHandler();
eventHandler.registerEvents(client);

client.login(process.env.DISCORD_TOKEN);
