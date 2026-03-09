import { sendEmbedMsg } from "./messageService.js";
import {
	createMessage,
	createError,
	createSuccess,
	createWarning,
} from "./embeds.js";

const sendUpdateMsg = (message) => sendEmbedMsg(message, "updates");

export const connectUpdate = () => {
	sendUpdateMsg(createSuccess("Connected", "Succesfully connected"));
};

export const kickUpdate = (info) => {
	sendUpdateMsg(createError("Kick", info));
};

export const reconnectUpdate = (info) => {
	sendUpdateMsg(createWarning("Reconnect", info));
};

export const deathUpdate = (info) => {
	sendUpdateMsg(createError("Death", info));
};

export const actionUpdate = (info) => {
	sendUpdateMsg(createMessage("Action", info));
};
