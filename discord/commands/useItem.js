import { SlashCommandBuilder } from "discord.js";
import { useItem } from "../../mineflayer/actions.js";

export const data = new SlashCommandBuilder()
	.setName("useitem")
	.setDescription("Makes bot use currently holding item")
	.addBooleanOption((option) =>
		option
			.setName("continuously")
			.setDescription("Use item continuously or not")
			.setRequired(true),
	);

export async function execute(interaction) {
	const continuously = interaction.options.getBoolean("continuously");
	if (useItem(continuously)) {
		await interaction.reply("Using the item");
	} else {
		await interaction.reply("Couldn't use the item");
	}
}
