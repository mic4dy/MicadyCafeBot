import { Client, Events, GatewayIntentBits } from 'discord.js'
import dotenv from 'dotenv'

dotenv.config()

const client = new Client({
  intents: [],
  partials: [],
})

client.once(Events.ClientReady, () => {
  console.log('Bot is ready')
  if (client.user) {
    console.log(`Logged in as ${client.user.tag}`)
  }
})

client.login(process.env.DISCORD_TOKEN)
