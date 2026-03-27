const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// 1. GET /api/events/nearby - Find events within a certain radius
router.get('/nearby', async (req, res) => {
  try {
    const { lng, lat, distance = 10000 } = req.query; // distance in meters

    if (!lng || !lat) {
      return res.status(400).json({ error: 'Longitude (lng) and Latitude (lat) are required.' });
    }

    const nearbyEvents = await Event.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(distance)
        }
      }
    });

    res.json(nearbyEvents);
  } catch (error) {
    console.error('Error fetching nearby events:', error);
    res.status(500).json({ error: 'Server error fetching nearby events.' });
  }
});

// 2. GET /api/events - Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Server error fetching events.' });
  }
});

// 3. POST /api/events - Create a new event
router.post('/', async (req, res) => {
  console.log('POST /api/events received with body:', req.body);
  try {

    const {
      title, description, category, date, longitude, latitude, address,
      collegeName, poster, link, whatsappNumber, price, capacity, tags,
      organizerName, registrationLink, isVerified, isFeatured
    } = req.body;

    const missing = [];
    if (!title) missing.push('title');
    if (!description) missing.push('description');
    if (!category) missing.push('category');
    if (!date) missing.push('date');
    if (longitude === undefined) missing.push('longitude');
    if (latitude === undefined) missing.push('latitude');
    if (!address) missing.push('address');

    if (missing.length > 0) {
      return res.status(400).json({ error: `Missing required event fields: ${missing.join(', ')}` });
    }

    const newEvent = new Event({
      title,
      description,
      category,
      date,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
        address: address,
      },
      collegeName: collegeName || 'Anonymous',
      poster,
      link: link || '',
      whatsappNumber,
      price,
      capacity,
      tags,
      organizerName,
      registrationLink,
      isVerified,
      isFeatured
    });

    const savedEvent = await newEvent.save();

    console.log('✅ Successfully saved to DB:', savedEvent._id);
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error('❌ Error creating event:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      console.log('Validation Error Messages:', messages);
      return res.status(400).json({ error: messages.join(', ') });
    }
    res.status(500).json({ error: 'Server error creating event.', details: error.message });
  }
});

module.exports = router;

