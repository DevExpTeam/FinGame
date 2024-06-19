const express = require('express');
const connectDB = require('./config/db');
var cors = require('cors')

const app = express();

// Connect Database
connectDB();

app.use(cors()) 

// Init Middleware
app.use(express.json({ extended: false }));
// app.use(express.json());

app.get('/', (req, res) => {
  res.send('API running');
});

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/scores', require('./routes/api/scores'));
app.use('/api/game1', require('./routes/api/game1'));
app.use('/api/game2', require('./routes/api/game2'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));