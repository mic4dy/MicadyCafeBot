import { Client } from "discord.js";
import fs from "fs";
import path from "path";
import { EventModule } from "./event_module.ts";

export class EventHandler {
  async registerEvents(client: Client): Promise<void> {
    const __dirname = import.meta.dirname;
    const eventFolders = fs.readdirSync(__dirname);
    const fileRegex = /\..+$/;

    for (const folder of eventFolders) {
      if (fileRegex.test(folder)) {
        continue;
      }

      const eventsPath = path.join(__dirname, folder);
      const eventFiles = fs
        .readdirSync(eventsPath)
        .filter((file) => file.endsWith(".ts"));

      for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event: EventModule = (await import(filePath)).default;
        if (event.once) {
          client.once(event.name, (...args) => event.execute(...args));
        } else {
          client.on(event.name, (...args) => event.execute(...args));
        }
      }
    }
  }
}
