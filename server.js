const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const connectDB = require('./config/connectDB');
const userRoutes = require('./routes/userRoutes');
const opinionRoutes = require('./routes/opinionsRoutes');
const app = express();
const PORT_NO = 5000;

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

dotenv.config();

connectDB();

app.get('/', (req, res) => {
  res.send('API is running');
});

app.use('/api/users', userRoutes);
app.use('/api/opinions', opinionRoutes);

app.listen(PORT_NO, () => {
  console.log(`Server Is Running On Port ${PORT_NO}`);
});
