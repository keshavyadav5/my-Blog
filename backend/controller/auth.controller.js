const User = require('../models/user.model')
const bcrypt = require('bcryptjs');
const { errorHandler } = require('../utils/error');

const SignUp = async (req, res, next) => {
  const { username, email, password } = req.body;

  const exitinguser = await User.findOne({ email })
  if (exitinguser) {
    return next(errorHandler(400, 'Email already exists'));
  }
  if (!email || !username || !password || email == '' || username == '' || password == '') {
    next(errorHandler(400, 'Please fill in all fields'))
  }
  const hashPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({
    username,
    email,
    password: hashPassword
  })
  try {
    await newUser.save()
    res.status(201).json({ message: 'User created successfully', success: true });
  } catch (error) {
    next(error)
  }
}

module.exports = {
  SignUp,

}