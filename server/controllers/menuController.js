const Menu = require('../models/Menu');

const getMenu = async (req, res) => {
  try {
    const menu = await Menu.find();
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createMenu = async (req, res) => {
  const { name, category, price, description } = req.body;
  const image = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : req.body.image;
  try {
    const dish = await Menu.create({ name, category, price, description, image });
    res.status(201).json(dish);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateMenu = async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };
  if (req.file) {
    updateData.image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  }
  try {
    const dish = await Menu.findByIdAndUpdate(id, updateData, { new: true });
    if (!dish) return res.status(404).json({ message: 'Dish not found' });
    res.json(dish);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteMenu = async (req, res) => {
  const { id } = req.params;
  try {
    const dish = await Menu.findByIdAndDelete(id);
    if (!dish) return res.status(404).json({ message: 'Dish not found' });
    res.json({ message: 'Dish deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getMenu, createMenu, updateMenu, deleteMenu };
