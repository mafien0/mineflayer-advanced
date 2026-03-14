import { SlashCommandBuilder } from "discord.js";
import { attack } from "../../mineflayer/actions.js";

export const data = new SlashCommandBuilder()
	.setName("attack")
	.setDescription("Makes bot punch a mob he's currently looking at");

export async function execute(interaction) {
	if (attack()) {
		await interaction.reply("punching the thing");
	} else {
		await interaction.reply("Couldn't punch the thing");
	}
}
