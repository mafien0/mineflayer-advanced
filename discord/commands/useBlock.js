import { SlashCommandBuilder } from "discord.js";
import { useBlock } from "../../mineflayer/actions.js";

export const data = new SlashCommandBuilder()
	.setName("useblock")
	.setDescription("Makes bot use a block he's currently looking at");

export async function execute(interaction) {
	if (useBlock()) {
		await interaction.reply("Using the block");
	} else {
		await interaction.reply("Couldn't use the block");
	}
}
