const mongoose = require('mongoose');
require('dotenv').config();

const resetDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eventfinder';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for clearing...');
    
    // Get all collections
    const collections = await mongoose.connection.db.collections();
    
    for (const collection of collections) {
      await collection.deleteMany({});
      console.log(`Cleared collection: ${collection.collectionName}`);
    }
    
    console.log('Successfully cleared all data from the database!');
    process.exit();
  } catch (err) {
    console.error('Reset error:', err);
    process.exit(1);
  }
};

resetDB();
