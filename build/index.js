import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import { CommandHandler } from "./commands/command_handler.js";
import { EventHandler } from "./events/event_handler.js";
dotenv.config();
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
    ],
    partials: [],
});
const commandHandler = new CommandHandler();
client.commands = await commandHandler.generateCollection();
const eventHandler = new EventHandler();
eventHandler.registerEvents(client);
client.login(process.env.DISCORD_TOKEN);
