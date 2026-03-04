import express from "express";
import { apiKeyMiddleware } from "./auth.js";

export function createRouter() {
	const app = express();
	app.use(express.json());

	// Routes

	app.get("/", (_, res) => {
		res.send("API is up");
	});

	return app;
}
