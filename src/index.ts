import { Client, Events } from "discord.js";
import dotenv from "dotenv";
import { handleCommands } from "./util/command_handler";

dotenv.config();

const client = new Client({
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

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
