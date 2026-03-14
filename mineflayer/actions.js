import { bot } from "./bot.js";
import { actionUpdate } from "../discord/updateService.js";

export function stop() {
	bot.clearControlStates();
	bot.deactivateItem();
	return true;
}

export function useItem(continuously) {
	actionUpdate("Using item");
	bot.activateItem();
	if (!continuously) {
		setTimeout(() => bot.deactivateItem(), 3000);
	}
	return true;
}

export function useBlock() {
	actionUpdate("Using block");
	const block = bot.blockAtCursor(5);
	if (!block) return false;

	bot.activateBlock(block);
	return true;
}

export function attack() {
	actionUpdate("Started attacking");
	const entity = bot.entityAtCursor(5);
	if (!entity) return false;
	bot.attack(entity);
	return true;
}

export function dig() {
	actionUpdate("Started digging");
	const block = bot.blockAtCursor(5);
	if (!block) return false;
	bot.dig(block);
	return true;
}

export function jump(continuously) {
	actionUpdate(continuously ? "Jumping continuosly" : "Jumped");
	bot.setControlState("jump", true);
	if (!continuously) {
		setTimeout(() => bot.setControlState("jump", false), 50);
	}
	return true;
}

export function move(direction, continuously) {
	if (!direction) return false;
	actionUpdate(
		continuously ? `Moving ${direction} continuously` : `Moving ${direction}`,
	);

	bot.setControlState(direction, true);
	if (!continuously) {
		setTimeout(() => bot.setControlState(direction, false), 1000);
	}
	return true;
}

export function sneak(isSneaking) {
	actionUpdate(isSneaking ? "Started sneaking" : "Stopped sneaking");
	bot.setControlState("sneak", isSneaking);
	return true;
}
