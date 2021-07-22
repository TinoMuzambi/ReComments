const withPWA = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");

module.exports = {
	// pwa: {
	// 	dest: "public",
	// 	runtimeCaching,
	// },
	webpack5: true,
	env: {
		GAPP_CLIENT_ID: process.env.GAPP_CLIENT_ID,
		GAPP_CLIENT_SECRET: process.env.GAPP_CLIENT_SECRET,
		GAPP_API_KEY: process.env.GAPP_API_KEY,
		MONGO_URI: process.env.MONGO_URI,
		GMAIL_PASS: process.env.GMAIL_PASS,
	},
};
