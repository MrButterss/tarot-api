require('dotenv').config();
const express = require('express');
const tarotRouter = require('./routes/tarot');

const app = express();
const PORT = process.env.PORT || 3001;

// Parse JSON request bodies — not strictly needed for GET-only today
// but keeps the server ready for Slice 3 POST endpoints.
app.use(express.json());

app.use('/api', tarotRouter);

app.listen(PORT, () => {
  console.log(`Tarot API running on port ${PORT}`);
});
