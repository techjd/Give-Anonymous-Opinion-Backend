const express = require('express');
const Users = require('../models/users');
const auth = require('../middleware/auth');
const Opinions = require('../models/opinions');
const router = express.Router();

// Give Opinion To Some User

router.get('/postOpinion/:username/:id', async (req, res) => {
  const { username, id } = req.params;
  const { nickname, text } = req.body;
  try {
    const user = await Users.findById(id).select('-password');

    if (!user) {
      return res.status(200).json({ msg: 'User Not Found' });
    }

    let opinion = new Opinions({
      userid: id,
      nickname,
      text,
    });

    await opinion.save();

    res.status(200).json({
      msg: 'Opinion Given Successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// Get Opinions Of A User
router.get('/getOpinions', auth, async (req, res) => {
  try {
    let opinions = await Opinions.find({ userid: req.user.id });

    res.status(200).json(opinions);
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
