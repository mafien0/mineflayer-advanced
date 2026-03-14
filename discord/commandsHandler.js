import { REST, Routes } from "discord.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function loadCommands() {
	const commands = [];
	const commandsPath = path.join(__dirname, "commands");
	const commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith(".js"));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = await import(`file://${filePath}`);

		if ("data" in command && "execute" in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(
				`The command at ${filePath} is missing a required "data" or "execute" property.`,
			);
		}
	}

	return commands;
}

export async function registerCommands(clientId, token) {
	const commands = await loadCommands();
	const rest = new REST().setToken(token);

	try {
		console.log(`Started refreshing ${commands.length} app commands`);

		const guildID = process.env.DISCORD_GUILD_ID;
		if (!guildID) {
			throw new Error("DISCORD_GUILD_ID environment variable is required");
		}

		await rest.put(Routes.applicationGuildCommands(clientId, guildID), {
			body: commands,
		});

		console.log(`Successfully reloaded ${commands.length} app commands`);
	} catch (error) {
		console.error(error);
	}
}

export async function createCommandHandler(client) {
	const commands = new Map();
	const commandsPath = path.join(__dirname, "commands");
	const commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith(".js"));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		try {
			const command = await import(`file://${filePath}`);

			if ("data" in command && "execute" in command) {
				commands.set(command.data.name, command);
				console.log(`Loaded command: ${command.data.name}`);
			} else {
				console.log(
					`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
				);
			}
		} catch (error) {
			console.error(`Failed to load command from ${filePath}:`, error);
		}
	}

	client.on("interactionCreate", async (interaction) => {
		if (!interaction.isChatInputCommand()) return;

		const command = commands.get(interaction.commandName);

		if (!command) {
			console.error(
				`No command matching ${interaction.commandName} was found.`,
			);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(
				`Error executing command ${interaction.commandName}:`,
				error,
			);

			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({
					content: "There was an error while executing this command!",
					ephemeral: true,
				});
			} else {
				await interaction.reply({
					content: "There was an error while executing this command!",
					ephemeral: true,
				});
			}
		}
	});

	console.log(`Command handler ready with ${commands.size} commands`);
	return commands;
}
