import { SlashCommandBuilder } from "discord.js";
import { sneak } from "../../mineflayer/actions.js";

export const data = new SlashCommandBuilder()
	.setName("sneak")
	.setDescription("Makes bot start/stop sneaking")
	.addBooleanOption((option) =>
		option
			.setName("action")
			.setDescription("Start or stop sneaking, defaults to true")
			.setRequired(false),
	);

export async function execute(interaction) {
	let action = interaction.options.getBoolean("action") ?? true;

	if (sneak(action)) {
		if (action) await interaction.reply("Started sneaking");
		else await interaction.reply("Stopped sneaking");
	} else {
		await interaction.reply("Something went wrong");
	}
}
