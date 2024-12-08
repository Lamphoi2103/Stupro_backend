const UserModel = require("../models/UserModel");

const userController = {
  getAllUser: async (req, res) => {
    try {
      const user = await UserModel.find();
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
module.exports = userController;
