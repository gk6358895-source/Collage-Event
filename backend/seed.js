const mongoose = require('mongoose');
const Event = require('./models/Event');
require('dotenv').config();

const dummyEvents = [
  {
    title: 'React Workshop 2024',
    description: 'Learn the latest features of React 19 and advanced hooks.',
    category: 'Workshop',
    date: new Date('2024-12-15'),
    location: {
      type: 'Point',
      coordinates: [80.2376, 13.0102], // Anna University area
      address: 'Anna University, Guindy, Chennai',
    },
    organizer: 'Tech Chennai',
    poster: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: 'HackChennai Focus',
    description: 'A 24-hour hackathon focusing on sustainability and AI.',
    category: 'Hackathon',
    date: new Date('2024-11-20'),
    location: {
      type: 'Point',
      coordinates: [80.2707, 13.0827], // Central Chennai
      address: 'Chennai Central, Park Town, Chennai',
    },
    organizer: 'OpenSource Community',
    poster: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: 'UI/UX Meetup',
    description: 'Monthly meetup for designers to discuss glassmorphism and modern trends.',
    category: 'Meetup',
    date: new Date('2024-11-10'),
    location: {
      type: 'Point',
      coordinates: [80.2442, 12.9801], // Adyar area
      address: 'Adyar Canal Bank Rd, Adyar, Chennai',
    },
    organizer: 'DesignX',
    poster: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=800'
  }

];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/eventfinder');
    console.log('Connected to MongoDB for seeding...');
    
    await Event.deleteMany({}); // Clear existing
    await Event.insertMany(dummyEvents);
    
    console.log('Successfully seeded 3 events!');
    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedDB();
