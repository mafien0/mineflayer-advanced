import { client } from "./client.js";

const status = {
	status: null,
	name: null,
	health: null,
	hunger: null,
	ping: null,
	coords: null,
	dimension: null,
};

function sendStatus() {
	const data = {};
	for (const [key, value] of Object.entries(status)) {
		if (value != null) data[key] = value;
	}
	client
		.post("/status/bulk-update", { data })
		.catch(() =>
			console.error("Failed to update status, is interface running?"),
		);
}

function fetchStatusInfo(bot) {
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

export const updateBotStatus = (bot) => {
	fetchStatusInfo(bot);
	sendStatus();
};
