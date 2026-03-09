import "dotenv/config";

import { createBot } from "./discord/bot.js";
import { setDiscordClient } from "./discord/messageService.js";
import { initChannels } from "./discord/messageService.js";
import { createStatusMsg } from "./discord/statusService.js";

import { connect } from "./mineflayer/bot.js";

// Connect discord bot
const discord = createBot();
const token = process.env.DISCORD_TOKEN;

if (!token) {
	throw new Error("DISCORD_TOKEN environment variable is required");
}

console.log("-".repeat(10) + "\nConnecting Discord bot\n");
discord.login(token).then(() => {
	console.log("Discord bot is up");
	setDiscordClient(discord);
	initChannels().then(() => {
		createStatusMsg();
	});
});

// Initialize bot
setTimeout(async () => {
	console.log("-".repeat(10) + "\nConnecting Mineflayer\n");
	const mineflayer = await connect();
}, 5000);
