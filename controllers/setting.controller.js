const asyncWrapper = require("../middleware/asyncWrapper");
const Setting = require("../models/setting.model");

const addSettings = asyncWrapper(async (req, res, next) => {
  const { storeName, storeEmail, storePhone, storeDescription , facebookLink , twitterLink , instagramLink , tiktokLink } = req.body;

  // Save the settings to the database
  const updatedSetting = await Setting.findOneAndUpdate(
    {},  // Assuming there's only one settings document
    {
      storeName,
      storeEmail,
      storePhone,
      storeDescription,
      storeLogo: req.files.storeLogo ? req.files.storeLogo[0].path : undefined,
      storeIcon: req.files.storeIcon ? req.files.storeIcon[0].path : undefined,
      facebookLink,
      twitterLink,
      instagramLink,
      tiktokLink
    },
    { new: true, upsert: true }  // upsert will create the document if it doesn't exist
  );

  res.status(200).json({ status: "SUCCESS", data: { setting: updatedSetting } });
});

const getSettings = asyncWrapper(async (req, res, next) => {
    const settings = await Setting.findOne({});  // Retrieve the single settings document
  
    if (!settings) {
      return res.status(404).json({ status: "ERROR", message: "Settings not found" });
    }
  
    res.status(200).json({ status: "SUCCESS", data: { settings } });
  });

module.exports = {
  addSettings,
  getSettings
};
