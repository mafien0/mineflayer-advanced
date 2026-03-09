// Hold a reference to the Discord client, set from index.js
let client = null;

import config from "../config.json" with { type: "json" };
const channelID = config.discord.channels;

// Channels will be filled on bot login
const CHANNELS = {
	chat: null,
	status: null,
	updates: null,
};

// Get discord client generated in `../index.js`
// Called after client login
export function setDiscordClient(discordClient) {
	if (!discordClient) throw new Error("Discord client is required");
	client = discordClient;
}

// Util function to get channel by its id
async function getChannelById(id) {
	if (!id) throw new Error("No channel ID provided");
	if (!client) throw new Error("Discord client is not initialized");

	try {
		// Fetch channel
		const channel = await client.channels.fetch(id);

		// Validate if channel exists and is it text channel
		if (!channel) {
			throw new Error(`Channel not found for ID: ${id}`);
		}
		if (!channel.isTextBased()) {
			throw new Error(`Channel ${id} is not text-based`);
		}

		// Return it
		return channel;
	} catch (error) {
		console.error(`Failed to fetch channel ${id}: ${error.message}`);
		throw error;
	}
}

// Initialize channels for CHANNELS object
// Called after client login
export async function initChannels() {
	try {
		CHANNELS.chat = await getChannelById(channelID.chat);
		CHANNELS.status = await getChannelById(channelID.status);
		CHANNELS.updates = await getChannelById(channelID.updates);
		console.log("All Discord channels initialized successfully");
	} catch (error) {
		console.error(`Failed to initialize channels: ${error.message}`);
		throw error;
	}
}

// Send messages function
export async function sendMsg(msg, channelType = "chat") {
	if (!msg) throw new Error("No message provided");

	// If channels not yet initialized
	if (!CHANNELS[channelType]) {
		setTimeout(() => sendMsg(msg, channelType), 1000);
	}

	try {
		console.log(`Sending message to "${channelType}" channel`);
		return await CHANNELS[channelType].send(msg);
	} catch (error) {
		console.error(
			`Failed to send message to "${channelType}" channel: ${error.message}`,
		);
		throw error;
	}
}
export const sendEmbedMsg = async (msg, channelType = "chat") =>
	sendMsg({ embeds: [msg] }, channelType);

// Wipe messaged util function
export async function wipeMessages(channelType = "status", limit = 100) {
	const channel = CHANNELS[channelType];
	const messages = await channel.messages.fetch({ limit });

	// Split by age
	// < 14d old
	const recent = messages.filter(
		(m) => Date.now() - m.createdTimestamp < 14 * 24 * 60 * 60 * 1000,
	);
	// > 14d old
	const old = messages.filter(
		(m) => Date.now() - m.createdTimestamp >= 14 * 24 * 60 * 60 * 1000,
	);

	// Bulk delete recent messages
	if (recent.size > 0) await channel.bulkDelete(recent);

	// Delete old messages one-by-one
	for (const [, msg] of old) {
		await msg.delete().catch(console.error);
		// With .5 second delay to prevent rate limiting
		await new Promise((resolve) => setTimeout(resolve, 500));
	}
}
