import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import dotenv from 'dotenv';

dotenv.config();

let mongoServer;

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      console.warn('⚠️ No MONGODB_URI found. Starting MongoDB Memory Server for demo mode...');
      mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      console.log('✅ In-memory MongoDB started successfully.');
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`🚀 MongoDB Connected: ${conn.connection.host}`);
    
    if (!process.env.MONGODB_URI) {
      console.warn('📝 NOTE: Data will be WIPED when this service stops or restarts.');
    }
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

