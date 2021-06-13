import mongoose from "mongoose";

const connection: {
	isConnected: boolean | number;
} = { isConnected: 0 };

const dbConnect = async () => {
	try {
		if (connection.isConnected) {
			return;
		}

		const db = await mongoose.connect(process.env.MONGO_URI || "", {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});

		connection.isConnected = db.connections[0].readyState;
		console.log("Database connected.");
	} catch (error) {
		return console.error(
			"Error connecting to the database. Contact the developer."
		);
	}
};

export default dbConnect;
