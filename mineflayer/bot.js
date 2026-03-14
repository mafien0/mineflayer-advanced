import mineflayer from "mineflayer";
import { attachListeners } from "./listeners.js";

import { reconnectUpdate } from "../discord/updateService.js";

import config from "../config.json" with { type: "json" };
const mfconfig = config.mineflayer;

const BASE_RECONNECT_TIMEOUT = mfconfig.base_reconnect_timeout || 5000;
const MAX_RECONNECT_ATTEMPTS = mfconfig.max_reconnect_attempts || 5;
let reconnectAttempts = 0;
let reconnectDelay = BASE_RECONNECT_TIMEOUT;

// Will be assigned/re-assigned on connect
export let bot;

export async function connect() {
	try {
		bot = mineflayer.createBot({
			host: mfconfig.host || "localhost",
			port: mfconfig.port || 25565,
			username: mfconfig.username || "bot",
			version: mfconfig.version || "1.21.11",
		});
		attachListeners(bot);

		bot.on("spawn", () => {
			// reset counters to their default state
			reconnectAttempts = 0;
			reconnectDelay = BASE_RECONNECT_TIMEOUT;
		});
	} catch (error) {
		console.error("Failed to create bot:", error.message);
		scheduleReconnect();
	}
}

let reconnectTimeout;
export async function scheduleReconnect() {
	if (reconnectTimeout) clearTimeout(reconnectTimeout);

	reconnectAttempts += 1;
	if (reconnectAttempts > MAX_RECONNECT_ATTEMPTS) {
		console.error("Max reconnect attempts reached, exiting...");
		process.exit(1);
	}

	// Assign current reconnect delay
	const delay = reconnectDelay;

	// Calculate next reconnect delay
	reconnectDelay = Math.min(reconnectDelay * 2, 60000);

	reconnectUpdate(
		`Reconnecting in ${delay / 1000} seconds... (attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`,
	);

	reconnectTimeout = setTimeout(() => {
		connect();
	}, delay);
}
