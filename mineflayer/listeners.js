import { updateBotStatus } from "../interface/status.js";
import { parseChat } from "../interface/chat.js";

export function attachListeners(bot) {
	bot.once("spawn", () => {
		const statusInterval = setInterval(() => updateBotStatus(bot), 10000);
	});

	bot.once("end", () => {
		clearInterval(bot._statusInterval);
	});

	bot.on("message", (jsonMsg) => {
		parseChat(jsonMsg);
		console.log(JSON.stringify(jsonMsg));
	});
}
