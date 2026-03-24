const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB Successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
const eventRoutes = require('./routes/events');
app.use('/api/events', eventRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

