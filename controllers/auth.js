import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import auth from '../config/firebase.config.js';

//____________________________REGISTER______________________________//

const saltRounds = 10;

const Rande = Math.floor(Math.random() * 1000);

export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picture,
      friends,
      location,
      occupation,
      imgUrl
    } = req.body;

    console.log(password);

    if (email === '' || password === '') {
      return res.status(418).json({ message: 'All fields are mandatory' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: 'The provided email is already registered' });
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: passwordHash,
      imgUrl: imgUrl || picture,
      friends,
      location,
      occupation,
      viewedProfile: Rande,
      impressions: Rande
    });

    res.json({
      email: newUser.email,
      firstName: newUser.firstName,
      _id: newUser._id
    });
  } catch (error) {
    console.log('An error occurred registering the user', error);
    res.status(500).json({ message: 'An error occurred registering the user' });
  }
};

//____________________________LOGIN______________________________//

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (email === '' || password === '') {
      return res.status(400).json({ message: 'All fields are mandatory' });
    }
    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ msg: 'User does not exist. ' });

    const isMatch = bcrypt.compare(password, user.password);

    if (isMatch) {
      const authToken = await auth.createCustomToken(user._id.toString(), {
        _id: user._id,
        email: user.email,
        firstName: user.firstName
      });

      //send the JWT as a response
      res.json({ authToken });
    } else {
      res.status(400).json({ message: 'Incorrect password' });
    }
  } catch (e) {
    console.log('An error ocurred in the user', e), next(e);
  }
};

//____________________________GOOGLE______________________________//

export const google = async (req, res) => {
  const { email, name } = req.body;
  try {
    // check if all parameters have been provided
    if (email === '' || name === '') {
      return res.status(400).json({ message: 'All fields are mandatory' });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.json({ message: 'User already exists' });
    }

    const firstName = name;

    await User.create({
      email,
      firstName
    });
    res.json({ message: 'User created successfully' });
  } catch (error) {
    console.log('An error occurred login the user', error);
  }
};

export const UploadPic = async (req, res, next) => {
  try {
    res.json({ fileUrl: req.file.path });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred uploading the image' });
    next(error);
  }
};
