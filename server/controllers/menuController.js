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
  const { name, khmerName, category, price, description } = req.body;
  const image = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : req.body.image;
  try {
    const dish = await Menu.create({ name, khmerName, category, price, description, image });
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

const getFeaturedMenu = async (req, res) => {
  try {
    const featured = await Menu.findOne({ isFeatured: true });
    if (!featured) return res.status(404).json({ message: 'No featured dish found' });
    res.json(featured);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const setFeaturedMenu = async (req, res) => {
  const { id } = req.params;
  try {
    // Unset any currently featured dish
    await Menu.updateMany({}, { isFeatured: false });
    
    // Set the new selected dish as featured
    const dish = await Menu.findByIdAndUpdate(id, { isFeatured: true }, { new: true });
    if (!dish) return res.status(404).json({ message: 'Dish not found' });
    
    res.json(dish);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getMenu, createMenu, updateMenu, deleteMenu, getFeaturedMenu, setFeaturedMenu };
