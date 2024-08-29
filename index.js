const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

const Item = mongoose.model('Item', itemSchema);

// Middleware
app.use(bodyParser.json());

// CRUD Operations
// Create Item
app.post('/items', async (req, res) => {
  const { name } = req.body;
  const item = new Item({ name });
  await item.save();
  res.status(201).json(item);
});

// Read All Items
app.get('/items', async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

// Read Item by ID
app.get('/items/:id', async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    return res.status(404).send('Item not found');
  }
  res.json(item);
});

// Update Item by ID
app.put('/items/:id', async (req, res) => {
  const { name } = req.body;
  const item = await Item.findByIdAndUpdate(req.params.id, { name }, { new: true });
  if (!item) {
    return res.status(404).send('Item not found');
  }
  res.json(item);
});

// Delete Item by ID
app.delete('/items/:id', async (req, res) => {
  const item = await Item.findByIdAndDelete(req.params.id);
  if (!item) {
    return res.status(404).send('Item not found');
  }
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
