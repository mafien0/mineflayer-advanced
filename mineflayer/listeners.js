import { parseChat } from "../discord/chatService.js";
import { updateStatus } from "../discord/statusService.js";

export function attachListeners(bot) {
	let statusInterval;

	bot.once("spawn", () => {
		updateStatus(bot);
		statusInterval = setInterval(() => updateStatus(bot), 10000);
	});

	bot.once("end", () => {
		clearInterval(statusInterval);
	});

	bot.on("message", (jsonMsg) => {
		parseChat(jsonMsg);
	});
}
