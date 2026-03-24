const mongoose = require('mongoose');
require('dotenv').config();
const Event = require('./models/Event');

async function checkEvents() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const events = await Event.find().sort({ createdAt: -1 }).limit(5);
        console.log('Last 5 events in DB:');
        events.forEach(e => {
            console.log(`- Title: ${e.title}, Date: ${e.date}, Category: ${e.category}, Address: ${e.location.address}`);
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkEvents();
