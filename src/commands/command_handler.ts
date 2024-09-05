import {
  Collection,
  CommandInteraction,
  REST,
  RouteLike,
  Routes,
  SlashCommandBuilder,
} from "discord.js";
import fs from "fs";
import path from "path";
import { CommandModule } from "./command_module.ts";

export class CommandHandler {
  /**
   * /src/commands/ 配下のコマンドを読み込み、コマンド名とコマンドの実行関数を紐づけた Collection を返す
   * - コマンドの実行関数は、`execute` という名前でエクスポートする必要がある
   * - `data` と `execute` が存在しないコマンドは警告を出力する
   * @returns コマンド名とコマンドの実行関数を紐づけた Collection
   */
  async generateCollection(): Promise<
    Collection<
      SlashCommandBuilder,
      (interaction: CommandInteraction) => Promise<void>
    >
  > {
    const commands = new Collection<
      SlashCommandBuilder,
      (interaction: CommandInteraction) => Promise<void>
    >();
    const __dirname = import.meta.dirname;
    const commandFolders = fs.readdirSync(__dirname);
    const fileRegex = /\..+$/;

    for (const folder of commandFolders) {
      if (fileRegex.test(folder)) {
        continue;
      }

      const commandsPath = path.join(__dirname, folder);
      const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith(".ts"));

      for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command: CommandModule = (await import(filePath)).default;
        if (command.data && command.execute) {
          commands.set(command.data, command.execute);
        } else {
          console.log(
            `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
          );
        }
      }
    }

    return commands;
  }

  /**
   * Client.commandsに登録するためのコマンドを生成する
   * @returns Client.commandsに登録するためのコマンド
   */
  async generateCommands(): Promise<
    Collection<string, (interaction: CommandInteraction) => Promise<void>>
  > {
    const commands = new Collection<
      string,
      (interaction: CommandInteraction) => Promise<void>
    >();
    const collections = await this.generateCollection();

    collections.each((value, key) => {
      commands.set(key.name, value);
    });

    return commands;
  }

  async deploy(fullRoute: RouteLike): Promise<void> {
    const discordToken = process.env.DISCORD_TOKEN;
    if (!discordToken) {
      throw new Error("Discord token is not defined.");
    }
    const rest = new REST().setToken(discordToken);

    const commands = await this.generateCollection();
    const commandSettings = commands.map((_, key) => key.toJSON());

    try {
      console.log(
        `Started refreshing ${commands.size} application (/) commands.`,
      );

      const data = await rest.put(fullRoute, {
        body: commandSettings,
      });

      console.log("--- Put data ---");
      console.log(data);

      console.log(
        `Successfully reloaded ${commands.size} application (/) commands.`,
      );
    } catch (error) {
      console.error(error);
    }
  }

  async deployGuildCommands(): Promise<void> {
    const clientID = process.env.DISCORD_CLIENT_ID;
    if (!clientID) {
      throw new Error("Client ID is not defined.");
    }

    const guildID = process.env.DISCORD_GUILD_ID;
    if (!guildID) {
      throw new Error("Guild ID is not defined.");
    }

    const fullRoute = Routes.applicationGuildCommands(clientID, guildID);
    await this.deploy(fullRoute);
  }

  async deployGlobalCommands(): Promise<void> {
    const clientID = process.env.DISCORD_CLIENT_ID;
    if (!clientID) {
      throw new Error("Client ID is not defined.");
    }

    const fullRoute = Routes.applicationCommands(clientID);
    await this.deploy(fullRoute);
  }
}
