import { updateBotStatus } from "../interface/status.js";
import { parseChat } from "../interface/chat.js";
import { scheldueReconnect } from "./bot.js";

export function attachListeners(bot) {
	let statusInterval;

	bot.once("spawn", () => {
		statusInterval = setInterval(() => updateBotStatus(bot), 10000);
	});

	bot.once("end", () => {
		clearInterval(statusInterval);
		scheldueReconnect();
	});

	bot.on("message", (jsonMsg) => {
		parseChat(jsonMsg);
	});
}
