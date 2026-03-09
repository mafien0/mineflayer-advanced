import { EmbedBuilder, resolveColor } from "discord.js";

import config from "../config.json" with { type: "json" };
const colors = config.discord.embed.colors;

// Embed generator
function generateEmbed(header, content, color = null) {
	if (!header) throw new Error("Header cannot be empty");
	if (!content) throw new Error("Content cannot be empty");
	if (!color) color = colors.white || "#ffffff";

	return new EmbedBuilder()
		.setTitle(header)
		.setDescription(content)
		.setColor(resolveColor(color));
}

// Different types of embeds
export const createMessage = (header, content) =>
	generateEmbed(header, content, colors.white || "#ffffff");
export const createError = (header, content) =>
	generateEmbed(header, content, colors.red || "#ff0000");
export const createSuccess = (header, content) =>
	generateEmbed(header, content, colors.green || "#00ff00");
export const createWarning = (header, content) =>
	generateEmbed(header, content, colors.yellow || "#ffff00");

// Status embed
export function createStatusEmbed(status) {
	if (!status) throw new Error("No status specified");
	const color =
		status.status.toLowerCase() === "online" ? colors.green : colors.gray;
	const time = Math.floor(Date.now() / 1000);

	return new EmbedBuilder().setTitle(status.name).setColor(color)
		.setDescription(`
\`\`\`
Health | ${status.health}
Hunger | ${status.hunger}
Ping   | ${status.ping}
\n${status.dimension}\n${status.coords}
${"-".repeat(30)}
${status.info}
\`\`\`
updated <t:${time}:R>
`);
}
