import mongoose from 'mongoose';

let cached = global.__mongooseCache;

if (!cached) {
  cached = global.__mongooseCache = { conn: null, promise: null };
}

export default async function connectDB() {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise || mongoose.connection.readyState === 0) {
    let uri = process.env.MONGODB_URI;

    cached.promise = (async () => {
      if (!uri) {
        if (process.env.NODE_ENV !== 'production') {
          try {
            const { MongoMemoryServer } = await import('mongodb-memory-server');
            if (!global.__mongoMemoryServer) {
              global.__mongoMemoryServer = await MongoMemoryServer.create();
            }
            uri = global.__mongoMemoryServer.getUri();
            console.log('Using MongoMemoryServer for development:', uri);
          } catch (e) {
            console.error('Failed to start MongoMemoryServer:', e);
            throw new Error('MONGODB_URI environment variable is not set and MongoMemoryServer is unavailable');
          }
        } else {
          throw new Error('MONGODB_URI environment variable is not set');
        }
      }

      try {
        const m = await mongoose.connect(uri, {
          bufferCommands: false,
          serverSelectionTimeoutMS: 5000,
        });
        return m;
      } catch (err) {
        // If local connection failed in dev, try falling back to MongoMemoryServer
        if (process.env.NODE_ENV !== 'production' && (uri.includes('127.0.0.1') || uri.includes('localhost'))) {
          console.warn('Local MongoDB connection failed, falling back to MongoMemoryServer...');
          try {
            const { MongoMemoryServer } = await import('mongodb-memory-server');
            if (!global.__mongoMemoryServer) {
              global.__mongoMemoryServer = await MongoMemoryServer.create();
            }
            const memUri = global.__mongoMemoryServer.getUri();
            const m = await mongoose.connect(memUri, {
              bufferCommands: false,
              serverSelectionTimeoutMS: 5000,
            });
            return m;
          } catch (memErr) {
            throw err;
          }
        }
        throw err;
      }
    })();
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
    throw e;
  }

  return cached.conn;
}
