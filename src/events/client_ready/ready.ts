import { Client, Events } from "discord.js";
import { EventModule } from "../event_module";

const event: EventModule = {
  name: Events.ClientReady,
  once: true,
  execute: async (client: Client) => {
    console.log("Bot is ready");
    if (client.user) {
      console.log(`Logged in as ${client.user.tag}`);
    }
  },
};

module.exports = event;
