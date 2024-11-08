// templates/TemplateModel.js
const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  hero: {
    title: String,
    subtitle: String,
    imgHero: String,
  },
  listProducts: {
    title: String,
    subtitle: String,
  },
  banner: {
    title: String,
    description: String,
    imgBanner: String,
  },
  slider: {
    title: String,
    subtitle: String,
  },
  bannerShop : {
    imgShop : String,
  }
});

module.exports = mongoose.model('Template', templateSchema);
