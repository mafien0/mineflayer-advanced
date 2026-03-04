import "dotenv/config";
import { createRouter } from "./api/routes.js";

// Create api
const app = createRouter();
const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`API is running on ${port}`);
});
