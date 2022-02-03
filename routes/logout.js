const express = require('express');
const router = express.Router();

//Models
const BlacklistTokenObject = require('../models/Blacklist');

// Logout
router.post('/', (req, res, next) => {
    // Add token to the blacklist. 
  const newBlacklistToken = new BlacklistTokenObject({
      mobile: req.decoded_mobile,
      token: req.token
  });
  const promise = newBlacklistToken.save();
  promise.then((data) => {
    if(!data){
        res.status(500).json({
            success: false,
            message: "Something went wrong! Try again later!"
        });
    }else{
        res.status(200).json({
            success: true,
            message: "You have been successfully logged out! Good bye!"
        });
    }
  }).catch((err) => {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Try again later."
    });
  });
});

module.exports = router;