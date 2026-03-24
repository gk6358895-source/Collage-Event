const mongoose = require('mongoose');
const Event = require('./models/Event');
require('dotenv').config();

const checkDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/eventfinder');
    const count = await Event.countDocuments();
    console.log(`Current items in DB: ${count}`);
    process.exit();
  } catch (err) {
    console.error('Check DB error:', err);
    process.exit(1);
  }
};

checkDB();
