import withPWA from "next-pwa";
import runtimeCaching from "next-pwa/cache";

export default withPWA({
	pwa: {
		dest: "public",
		runtimeCaching,
	},
	future: {
		webpack5: true,
	},
	env: {
		GAPP_CLIENT_ID: process.env.GAPP_CLIENT_ID,
		GAPP_CLIENT_SECRET: process.env.GAPP_CLIENT_SECRET,
		GAPP_API_KEY: process.env.GAPP_API_KEY,
		MONGO_URI: process.env.MONGO_URI,
		GMAIL_PASS: process.env.GMAIL_PASS,
	},
});
