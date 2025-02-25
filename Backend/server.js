const express = require('express');
const { connectToDatabase } = require('./database');
const cors = require('cors');
const shortid = require('shortid');
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE',
  })
);


app.get('/', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collections = await db.listCollections().toArray();
    res.status(200).json({ message: 'Connected to MongoDB!', collections });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve collections.' });
  }
});


app.post('/api/UrlShortener', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const url = req.body.url;

    if (!url || !/^https?:\/\/.+/.test(url)) {
      return res.status(400).json({ message: 'Invalid URL format' });
    }

    const token = shortid.generate(); 
    const urlsCollection = db.collection('Urls');
    const result = await urlsCollection.insertOne({ url, token });

    console.log('Inserted URL:', result); 

    const shortUrl = `http://localhost:${PORT}/u/${token}`;
    res.status(200).json({
      message: 'URL shortened successfully',
      shortUrl,
      token,
      originalUrl: url,
    });
  } catch (error) {
    console.error('Error creating shortened URL:', error);
    res.status(500).json({ message: 'Error creating shortened URL', error });
  }
});
app.get('/u/:token', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const token = req.params.token;
    console.log('Searching for Token:', token);

    const urlsCollection = db.collection('Urls');
    console.log('Connected Collection:', urlsCollection.namespace);

    const urlData = await urlsCollection.findOne({ token: token });
    console.log('Query Result:', urlData);

    if (!urlData) {
      return res.status(404).json({ message: 'URL not found' });
    }

    return res.redirect(urlData.url);
  } catch (error) {
    console.error('Error retrieving URL:', error);
    res.status(500).json({ message: 'Error retrieving URL', error });
  }
});

const PORT = 9000;
const startServer = async () => {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
  }
};

startServer();
