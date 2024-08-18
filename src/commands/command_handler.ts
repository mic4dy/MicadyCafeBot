import {
  Collection,
  CommandInteraction,
  REST,
  RouteLike,
  Routes,
} from "discord.js";
import fs from "fs";
import path from "path";
import { CommandModule } from "./command_module";

export class CommandHandler {
  /**
   * /src/commands/ 配下のコマンドを読み込み、コマンド名とコマンドの実行関数を紐づけた Collection を返す
   * - コマンドの実行関数は、`execute` という名前でエクスポートする必要がある
   * - `data` と `execute` が存在しないコマンドは警告を出力する
   * @returns コマンド名とコマンドの実行関数を紐づけた Collection
   */
  async generateCollection(): Promise<
    Collection<string, (interaction: CommandInteraction) => Promise<void>>
  > {
    const commands = new Collection<
      string,
      (interaction: CommandInteraction) => Promise<void>
    >();
    const foldersPath = path.join(__dirname, "commands");
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
      const commandsPath = path.join(foldersPath, folder);
      const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith(".js"));
      for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command: CommandModule = await import(filePath);
        if (command.data && command.execute) {
          commands.set(command.data.name, command.execute);
        } else {
          console.log(
            `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
          );
        }
      }
    }

    return commands;
  }

  async deploy(fullRoute: RouteLike): Promise<void> {
    const discordToken = process.env.DISCORD_TOKEN;
    if (!discordToken) {
      throw new Error("Discord token is not defined.");
    }
    const rest = new REST().setToken(discordToken);

    const commands = await this.generateCollection();

    try {
      console.log(
        `Started refreshing ${commands.each.length} application (/) commands.`,
      );

      const data = await rest.put(fullRoute, {
        body: commands.keys,
      });

      console.log(
        `Successfully reloaded ${commands.keys.length} application (/) commands.`,
      );
    } catch (error) {
      console.error(error);
    }
  }

  async deployGuildCommands(): Promise<void> {
    const clientID = process.env.CLIENT_ID;
    if (!clientID) {
      throw new Error("Client ID is not defined.");
    }

    const guildID = process.env.GUILD_ID;
    if (!guildID) {
      throw new Error("Guild ID is not defined.");
    }

    const fullRoute = Routes.applicationGuildCommands(clientID, guildID);
    await this.deploy(fullRoute);
  }

  async deployGlobalCommands(): Promise<void> {
    const clientID = process.env.CLIENT_ID;
    if (!clientID) {
      throw new Error("Client ID is not defined.");
    }

    const fullRoute = Routes.applicationCommands(clientID);
    await this.deploy(fullRoute);
  }
}
