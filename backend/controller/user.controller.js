const { errorHandler } = require("../utils/error");
const bcryptjs = require('bcryptjs');
const User = require('../models/user.model');

const test = (req, res) => {
  res.json({ message: "API is working" });
};

const updateUser = async (req, res, next) => {
  console.log(req.params)
  try {
    if (req.id !== req.params.userId) {
      console.log("id didn't match")
      return res.status(403).json({ message: "You can only update your own account" });
    }

    const updateData = {
      email: req.body.email,
      profilePicture: req.body.profilePicture,
    };



    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  if (req.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this user"))
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({ message: "User deleted successfully" });

  } catch (error) {
    next(error)
  }
}
const signout = (req, res, next) => {
  try {
    res.clearCookie('access_token')
      .status(200)
      .json({ message: 'User has been signed out' });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to access this user"))
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sorDirection = req.query.sort === 'asc' ? 1 : -1;

    const users = await User.find()
    .sort({createdAt : sorDirection})
    .skip(startIndex)
    .limit(limit)

    const userWithoutPassword = users.map((user) => {
      const { password, ...rest} = user._doc;
      return rest;
    })

    const totalUsers = await User.countDocuments();

    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: lastMonth }
    })

    res.status(200).json({
      users: userWithoutPassword,
      totalUsers,
      lastMonthUsers
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  test,
  updateUser,
  deleteUser,
  signout,
  getUser
};
