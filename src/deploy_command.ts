import dotenv from "dotenv";
import { CommandHandler } from "./commands/command_handler.ts";

dotenv.config();

const commandHandler = new CommandHandler();
await commandHandler.deployGuildCommands();
