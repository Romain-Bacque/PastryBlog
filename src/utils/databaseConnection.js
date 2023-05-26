import mongoose from "mongoose";

const connectionString = `mongodb+srv://${process.env.mongodb_username}:${process.env.mongodb_password}@${process.env.mongodb_clustername}.n0bnltg.mongodb.net/${process.env.mongodb_database}?retryWrites=true&w=majority`;

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = mongoose
      .connect(connectionString, opts)
      .then((mongoose) => {
        console.log("Connected to database !");
        return mongoose;
      })
      .catch(console.error("Can't connect to database !"));
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
