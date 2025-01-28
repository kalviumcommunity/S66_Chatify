// import mongoose from 'mongoose';
const mongoose=require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI );
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    
  }
};

module.exports = connectDB;