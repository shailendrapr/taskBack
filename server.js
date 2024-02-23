// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());


// Middleware
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});


// Connect to MongoDB
mongoose.connect('mongodb+srv://admin-shailendra:test123@cluster0.bzjmmlj.mongodb.net/mydb');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));



// Define a schema for your data
const dataSchema = new mongoose.Schema({
  text: String
});
const Data = mongoose.model('Data', dataSchema);



// API routes
app.post('/api/add', async (req, res) => {
  try {
    // Add new data
    await Data.create(req.body);
    res.status(201).send('Data added successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});




app.patch('/api/update', async (req, res) => {
  try {
    // Update existing data
    Data.find().sort({_id:-1}).limit(1).then((result) => {
      //console.log(result);
      Data.findByIdAndUpdate(result[0]._id,{$set:{text: req.body.text}});
    });
    res.status(200).send('Data updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
