const express = require('express');
const Users = require('../models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const router = express.Router();

// Get Information of the Logged In User
router.get('/getUserInfo', auth, async (req, res) => {
  try {
    const user = await Users.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// Register A New User
router.post('/registerUser', async (req, res) => {
  const { username, fullName, email, password, bio } = req.body;

  try {
    let user = await Users.findOne({ email });

    if (user) {
      return res.status(200).json({ msg: 'User Already Existed' });
    }

    let userName = await Users.findOne({ username });

    if (userName) {
      return res
        .status(200)
        .json({ msg: 'Please Choose A Different Username' });
    }

    user = new Users({
      username,
      fullName,
      email,
      password,
      bio,
    });

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWTSECRET,
      { expiresIn: 36000000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// Login A New User
router.post('/loginUser', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await Users.findOne({ email });

    if (!user) {
      return res.json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWTSECRET,
      { expiresIn: 36000000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// Update Bio Of A User
router.post('/updateBio', auth, async (req, res) => {
  const { bio } = req.body;

  try {
    const user = await Users.findById(req.user.id).select('-password');
    user.bio = bio;

    await user.save();

    res.status(201).json({ msg: 'Bio SuccessFully Updated' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server Error' });
  }
});
module.exports = router;
