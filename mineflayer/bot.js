import mineflayer from "mineflayer";
import { attachListeners } from "./listeners.js";
import config from "../config.json" with { type: "json" };

const BASE_RECONNECT_TIMEOUT = config.base_reconnect_timeout || 5000;
const MAX_RECONNECT_ATTEMPTS = config.max_reconnect_attempts || 5;
let reconnectAttempts = 0;
let reconnectDelay = BASE_RECONNECT_TIMEOUT;

// Will be assigned/re-assigned on connect
export let bot;

export async function connect() {
	try {
		bot = mineflayer.createBot({
			host: config.bot.host || "localhost",
			port: config.bot.port || 25565,
			username: config.bot.username || "bot",
			version: config.bot.version || "1.21.11",
		});
		attachListeners(bot);

		// reset counters to their default state
		bot.on("spawn", () => {
			reconnectAttempts = 0;
			reconnectDelay = BASE_RECONNECT_TIMEOUT;
		});
	} catch {
		scheldueReconnect();
	}
}

let reconnectTimeout;
export async function scheldueReconnect() {
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

	// TODO: Send to the interface as an update
	console.log(
		`Reconnecting in ${delay / 1000} seconds... (attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`,
	);

	reconnectTimeout = setTimeout(() => {
		// TODO: Send to the interface as an update
		console.log("Reconnecting...");
		connect();
	}, delay);
}
