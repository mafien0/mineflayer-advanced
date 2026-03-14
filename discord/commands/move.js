import { SlashCommandBuilder } from "discord.js";
import { move } from "../../mineflayer/actions.js";

export const data = new SlashCommandBuilder()
	.setName("move")
	.setDescription("Makes bot move to a set direction")
	.addStringOption((option) =>
		option
			.setName("direction")
			.setDescription("Direction to move to")
			.setRequired(true)
			.addChoices(
				{ name: "forward", value: "forward" },
				{ name: "back", value: "back" },
				{ name: "left", value: "left" },
				{ name: "right", value: "right" },
			),
	)
	.addBooleanOption((option) =>
		option
			.setName("continuously")
			.setDescription("Move continuously or not, defaults to true")
			.setRequired(false),
	);

export async function execute(interaction) {
	const direction = interaction.options.getString("direction");
	const continuously = interaction.options.getBoolean("continuously") ?? true;
	if (move(direction, continuously)) {
		await interaction.reply("Moving");
	} else {
		await interaction.reply("Something went wrong");
	}
}
