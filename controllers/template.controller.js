// templates/TemplateController.js
// const Template = require("../models/template.model")
const asyncWrapper = require("../middleware/asyncWrapper");
const templateModel = require("../models/template.model");

const updateTemplate = asyncWrapper(async (req, res) => {
  // Validate the request body
  const { hero, listProducts, banner, slider, bannerShop } = req.body;
  const { imgHero, imgBanner, imgShop } = req.files;
  
  try {
    const updatedData = {
        ...hero && { "hero": { ...hero, imgHero: imgHero ? imgHero[0].path : hero.imgHero } },
        ...listProducts && { "listProducts": listProducts },
        ...banner && { "banner": { ...banner, imgBanner: imgBanner ? imgBanner[0].path : banner.imgBanner } },
        ...slider && { "slider": slider },
        ...bannerShop && { "bannerShop": { ...bannerShop, imgShop: imgShop ? imgShop[0].path : bannerShop.imgShop } },
      }; 
    const updatedTemplate = await templateModel.findOneAndUpdate(
      {}, // Assuming there's only one settings document
      { $set: updatedData },
      { new: true, upsert: true } // upsert will create the document if it doesn't exist
    );
    res.status(200).json(updatedTemplate);
  } catch (error) {
    res.status(500).json({ message: "Failed to update template" });
  }
});

const getTemplates = asyncWrapper(async (req, res, next) => {
  const template = await templateModel.findOne({}); // Retrieve the single settings document

  if (!template) {
    return res
      .status(404)
      .json({ status: "ERROR", message: "Settings not found" });
  }

  res.status(200).json({ status: "SUCCESS", data: template });
});

module.exports = {
  updateTemplate,
  getTemplates,
};
