module.exports = {
	future: {
		webpack5: true,
	},
	env: {
		GAPP_CLIENT_ID: process.env.GAPP_CLIENT_ID,
		GAPP_CLIENT_SECRET: process.env.GAPP_CLIENT_SECRET,
		GAPP_API_KEY: process.env.GAPP_API_KEY,
		MONGO_URI: process.env.MONGO_URI,
	},
};
