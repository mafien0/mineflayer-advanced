import { Client, Events, GatewayIntentBits } from "discord.js";

export function createBot() {
	const client = new Client({ intents: [GatewayIntentBits.Guilds] });

	client.once(Events.ClientReady, (c) => {
		console.log(`Discord bot logged in as ${c.user.tag}`);
	});

	return client;
}
