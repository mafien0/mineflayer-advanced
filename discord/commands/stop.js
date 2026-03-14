import { SlashCommandBuilder } from "discord.js";
import { stop } from "../../mineflayer/actions.js";

export const data = new SlashCommandBuilder()
	.setName("stop")
	.setDescription("Stops all the bot actions");

export async function execute(interaction) {
	if (stop()) {
		await interaction.reply("Succesfully stoped all the actions");
	} else {
		await interaction.reply("Something went wrong");
	}
}
