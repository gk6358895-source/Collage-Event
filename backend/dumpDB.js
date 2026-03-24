const mongoose = require('mongoose');
const Event = require('./models/Event');
require('dotenv').config();

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const events = await Event.find({});
        console.log('Total events in DB:', events.length);
        console.log('Events:', JSON.stringify(events, null, 2));
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};
test();
