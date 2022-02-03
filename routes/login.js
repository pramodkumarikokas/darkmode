const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Models
const UserObject = require('../models/User');

// Verify OTP and login.
router.post('/', (req, res, next) => {
 // console.log("YYYYYYYYYYYYYYYY  ",req.body)
  const {
    otp
  } = req.body;
  const decoded_mobile = req.decoded_mobile;
  const promise = UserObject.findOne({
    mobile: decoded_mobile
  });
  promise.then((data) => {
    if (!data) {
      res.status(500).json({
        success: false,
        message: "Oops! We are sorry! Something went wrong!"
      });
    } else {
      bcrypt.compare(otp, data.otp).then((result) => {
        if (!result) {
          res.status(401).json({
            success: false,
            message: "Authentication failed. Wrong otp!"
          });
        } else {
          // Prepare a token.
          const payload = {
            mobile: decoded_mobile
          };
          const token = jwt.sign(payload, process.env.APISECRETKEY, {
            expiresIn: 86400 * 30 // This token expires 30 days later. 
          });
          res.status(200).json({
            success: true,
            message: "Successfully login!",
            token: token,
            data:data
          });
        }
      }).catch((err) => {
        console.log(err);
        res.status(500).json({
          success: false,
          message: "Something went wrong. Try again later."
        });
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