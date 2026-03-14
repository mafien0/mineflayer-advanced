import { Client, Events, GatewayIntentBits } from "discord.js";
import { registerCommands, createCommandHandler } from "./commandsHandler.js";

export function createBot() {
	const client = new Client({ intents: [GatewayIntentBits.Guilds] });

	client.once(Events.ClientReady, async (c) => {
		console.log(`Discord bot logged in as ${c.user.tag}`);
		
		const token = process.env.DISCORD_TOKEN;
		if (token) {
			await registerCommands(c.user.id, token);
		}
	});

	createCommandHandler(client).catch(console.error);

	return client;
}
