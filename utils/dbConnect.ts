import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
	throw new Error(
		"Please define the MONGODB_URI environment variable inside .env.local"
	);
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached: any;

if (!cached) {
	cached = { conn: null, promise: null };
}

const dbConnect: Function = async (): Promise<void> => {
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		const opts = {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			bufferCommands: false,
			bufferMaxEntries: 0,
			useFindAndModify: false,
			useCreateIndex: true,
		};

		cached.promise = mongoose
			.connect(MONGO_URI as string, opts)
			.then((mongoose) => {
				return mongoose;
			});
	}
	cached.conn = await cached.promise;
	return cached.conn;
};

export default dbConnect;
