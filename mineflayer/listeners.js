import { parseChat } from "../discord/chatService.js";
import { updateStatus } from "../discord/statusService.js";

import {
	connectUpdate,
	kickUpdate,
	banUpdate,
	disconnectUpdate,
} from "../discord/updateService.js";
import { scheduleReconnect } from "./bot.js";

export function attachListeners(bot) {
	let statusInterval;

	bot.once("spawn", () => {
		updateStatus(bot);
		connectUpdate();
		statusInterval = setInterval(() => updateStatus(bot), 10000);
	});

	bot.once("end", () => {
		clearInterval(statusInterval);
		updateStatus();
		// Schedule reconnect 1 second later so reconnect message will show after kick message
		setTimeout(() => scheduleReconnect(), 1000);
	});

	bot.on("kicked", (rawReason) => {
		// Kick messages are really stupid, and return whatever it wants, so we need to check for each case
		const reason =
			typeof rawReason === "string" ? JSON.parse(rawReason) : rawReason;
		console.log(reason);
		console.log(typeof rawReason);

		const value = reason.value?.translate?.value ?? reason.translate;
		const withArr = reason.value?.with ?? reason.with;

		if (value === "multiplayer.disconnect.banned.reason") {
			if (typeof withArr[0] === "string") {
				banUpdate(`Reason: ${withArr?.[0]}`);
				return;
			} else {
				banUpdate("No reason specified");
				return;
			}
		}

		if (reason.type === "string") {
			kickUpdate(`Reason: ${reason.value}`);
			return;
		}
		if (value === "multiplayer.disconnect.kicked") {
			kickUpdate("No reason specified");
			return;
		}
		if (value === "multiplayer.disconnect.banned") {
			banUpdate("Bot got banned");
			return;
		}
		if (value === "multiplayer.disconnect.duplicate_login") {
			disconnectUpdate(`${bot.username} logged on from another location`);
			return;
		}

		// If haven't handled, send raw json
		disconnectUpdate(JSON.stringify(reason));
	});

	bot.on("message", (jsonMsg) => {
		parseChat(jsonMsg);
	});
}
