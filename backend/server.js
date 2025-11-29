const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(bodyParser.json());


// MongoDB connection (use env variable for deployment)
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mysticpathways';
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Schemas
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    contact: String,
    whatsapp: String,
    password: String
});

const reviewSchema = new mongoose.Schema({
    user: String,
    text: String,
    date: { type: Date, default: Date.now }
});

const serviceSchema = new mongoose.Schema({
    name: String,
    description: String
});

const placeSchema = new mongoose.Schema({
    name: String,
    description: String,
    image: String
});

const User = mongoose.model('User', userSchema);
const Review = mongoose.model('Review', reviewSchema);
const Service = mongoose.model('Service', serviceSchema);
const Place = mongoose.model('Place', placeSchema);

// Registration endpoint
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, contact, whatsapp, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, contact, whatsapp, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'User not found' });
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(400).json({ error: 'Invalid password' });
        res.json({ message: 'Login successful', user: { name: user.name, email: user.email } });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Reviews endpoints
app.get('/api/reviews', async (req, res) => {
    const reviews = await Review.find();
    res.json(reviews);
});

app.post('/api/reviews', async (req, res) => {
    try {
        const { user, text } = req.body;
        const review = new Review({ user, text });
        await review.save();
        res.status(201).json({ message: 'Review added' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Services endpoints
app.get('/api/services', async (req, res) => {
    const services = await Service.find();
    res.json(services);
});

// Places endpoints
app.get('/api/places', async (req, res) => {
    const places = await Place.find();
    res.json(places);
});

// Add service (admin only, for demo)
app.post('/api/services', async (req, res) => {
    try {
        const { name, description } = req.body;
        const service = new Service({ name, description });
        await service.save();
        res.status(201).json({ message: 'Service added' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Add place (admin only, for demo)
app.post('/api/places', async (req, res) => {
    try {
        const { name, description, image } = req.body;
        const place = new Place({ name, description, image });
        await place.save();
        res.status(201).json({ message: 'Place added' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// Serve static files (frontend) from project root
const path = require('path');
app.use(express.static(path.join(__dirname, '../public')));

// SPA support: send index.html for unknown routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
