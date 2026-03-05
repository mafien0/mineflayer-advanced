import { client } from "./client.js";

function sendMessage(message) {
	client.post("/message/send", {
		content: message,
	});
}

function extractTextFromObject(obj) {
	if (typeof obj === "string") return obj;
	if (Array.isArray(obj)) {
		// Concatenate all text from array items
		return obj
			.map(extractTextFromObject)
			.filter((t) => t)
			.join("");
	}
	if (obj && typeof obj === "object") {
		// Check text property
		if (obj.text && typeof obj.text === "string" && obj.text.trim()) {
			return obj.text;
		}
		// Check extra array
		if (obj.extra) {
			const extraText = extractTextFromObject(obj.extra);
			if (extraText) return extraText;
		}
		// Check value in hover_event
		if (obj.hover_event?.value) {
			const hoverText = extractTextFromObject(obj.hover_event.value);
			if (hoverText) return hoverText;
		}
	}
	return null;
}

function extractLinks(obj, links = []) {
	if (Array.isArray(obj)) {
		obj.forEach((item) => extractLinks(item, links));
	} else if (obj && typeof obj === "object") {
		if (obj.click_event?.action === "open_url" && obj.click_event.url) {
			const extractedText = extractTextFromObject(obj);
			const text =
				extractedText && extractedText.trim() ? extractedText.trim() : "Link";
			links.push({ url: obj.click_event.url, text });
		}
		Object.values(obj).forEach((value) => extractLinks(value, links));
	}
	return links;
}

export function parseChat(message) {
	const raw = message.json || message;
	const links = extractLinks(raw);
	const fullText = message.toString();

	// Extract all bracketed text
	const bracketMatches = fullText.match(/\[([^\]]+)\]/g) || [];
	const bracketedTexts = bracketMatches.map((m) => m.slice(1, -1));

	const formatted = links
		.map(({ url, text }, index) => {
			let displayText = text;

			// Remove square brackets
			displayText = displayText.replace(/^\[|\]$/g, "").replace(/^\(|\)$/g, "");

			// Always prefer bracketed text if available for this link
			if (bracketedTexts[index]) {
				displayText = bracketedTexts[index];
			}
			// If still empty/generic after cleaning, use default
			if (
				!displayText ||
				/^\(?link\)?$/i.test(displayText) ||
				/^[\[\]()\s]+$/.test(displayText)
			) {
				displayText = "Link";
			}

			return `[${displayText}](${url})`;
		})
		.join(" ");

	sendMessage(formatted || fullText);
}
