const User = require('../models/user.model')
const bcrypt = require('bcryptjs');
const { errorHandler } = require('../utils/error');
const jwt = require('jsonwebtoken')

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

const SignIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(400, 'Email or password is incorrect'));
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return next(errorHandler(400, 'Email or password is incorrect'));
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: '1h',
    });

    const { password: pass, ...rest } = user._doc
    res.cookie("access_token", token, { httpOnly: true }).status(200).json({
      success: true,
      message: "Login successfull",
      rest
    })
  } catch (error) {
    console.log(error);
    next(error);
  }
};


module.exports = {
  SignUp,
  SignIn,
}