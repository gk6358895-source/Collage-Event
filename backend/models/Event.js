const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Workshop', 'Hackathon', 'Meetup', 'Conference', 'Paper presentation','Seminar','Others']
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude] array
      required: true,
    },
    address: {
      type: String, // Full string address
      required: true,
    },
  },
  collegeName: {
    type: String, // Name of the college/university
    required: true,
    default: 'Anonymous',
  },
  poster: {
    type: String, // URL to the poster image
    default: 'https://images.unsplash.com/photo-1540575861501-7ce0e224271a?auto=format&fit=crop&q=80&w=800',
  },
  link: {
    type: String, // URL to college website or event page
    default: '',
  },
  createdAt: {

    type: Date,
    default: Date.now,
  },
});

eventSchema.index({ location: '2dsphere' });
// Automatically delete events 24 hours after the event date
eventSchema.index({ date: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model('Event', eventSchema);
