import { Client } from "discord.js";
import fs from "fs";
import path from "path";
import { EventModule } from "./event_module";

export class EventHandler {
  async registerEvents(client: Client): Promise<void> {
    const foldersPath = path.join(__dirname, "events");
    const eventFolders = fs.readdirSync(foldersPath);

    for (const folder of eventFolders) {
      const eventsPath = path.join(foldersPath, folder);
      const eventFiles = fs
        .readdirSync(eventsPath)
        .filter((file) => file.endsWith(".js"));

      for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event: EventModule = await import(filePath);
        if (event.once) {
          client.once(event.name, (...args) => event.execute(...args));
        } else {
          client.on(event.name, (...args) => event.execute(...args));
        }
      }
    }
  }
}
