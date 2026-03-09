import { createStatusEmbed } from "./embeds.js";
import { sendEmbedMsg, wipeMessages } from "./messageService.js";

let statusMsg;

const status = {
	status: "offline",
	name: null,
	health: null,
	hunger: null,
	ping: null,
	coords: null,
	dimension: null,
	info: "No info specified",
};

function fetchStatus(bot) {
	if (!bot) return;

	status.status = "Online";
	status.name = bot.username;
	status.health = bot.health;
	status.hunger = bot.food;
	status.ping = bot.player.ping;
	status.dimension = bot.game.dimension;

	// Position
	if (bot.entity?.position) {
		const pos = bot.entity.position;
		status.coords = `${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}, ${pos.z.toFixed(1)}`;
	}
}

export async function createStatusMsg() {
	// Delete all old messages in the channel
	try {
		await wipeMessages("status");
	} catch (error) {
		console.error(
			`Failed to wipe messages in status channel: ${error.message}`,
		);
		// No need to throw it back
		// Its not that of an issue if there is old messages in the channel
	}

	// Send a new one
	try {
		const embed = createStatusEmbed(status);
		const msg = await sendEmbedMsg(embed, "status");
		statusMsg = msg;

		console.log(`Sent initial status message ${msg.id}`);
		return msg;
	} catch (error) {
		console.error(`Failed to create status message: ${error.message}`);
		throw error;
	}
}

export async function updateStatus(bot) {
	// Fetch bot status if bot is provided
	if (bot) {
		fetchStatus(bot);
	} else {
		// Bot is offline
		status.status = "Offline";
		status.name = "Bot";
		status.health = null;
		status.hunger = null;
		status.ping = null;
		status.coords = null;
		status.dimension = null;
	}

	// If there is no status message, create a new one
	if (!statusMsg) {
		await createStatusMsg();
		return;
	}

	// If there is, try to update it
	try {
		const embed = createStatusEmbed(status);
		await statusMsg.edit({ embeds: [embed] });
	} catch (error) {
		console.error(`Failed to update status message: ${error.message}`);
	}
}
