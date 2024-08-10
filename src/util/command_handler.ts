import { Collection, SlashCommandBuilder } from "discord.js";
import fs from "fs";
import path from "path";

/**
 * /src/commands/ 配下のコマンドを読み込み、コマンド名とコマンドの実行関数を紐づけた Collection を返す
 * - コマンドの実行関数は、`execute` という名前でエクスポートする必要がある
 * - `data` と `execute` が存在しないコマンドは警告を出力する
 * @returns {Collection<SlashCommandBuilder, Function>} コマンド名とコマンドの実行関数を紐づけた Collection
 */
export function handleCommands(): Collection<SlashCommandBuilder, Function> {
  const commands = new Collection<SlashCommandBuilder, Function>();
  const foldersPath = path.join(__dirname, "commands");
  const commandFolders = fs.readdirSync(foldersPath);

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      if ("data" in command && "execute" in command) {
        commands.set(command.data.name, command);
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
        );
      }
    }
  }

  return commands;
}
