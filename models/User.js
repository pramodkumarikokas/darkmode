const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    mobile: {type:String, unique:true},
    email: {type:String},
    otp: {type:String},
    image: {type:String},
    fname: {type:String},
    lname: {type:String},
    image: {type:String},
    isDeleteUserStatus: {
    type: Boolean,
     default: false
  },
    user_createdAt:{ type: Date, default: Date.now },
     user_updatedAt:{ type: Date, default: Date.now }
});
module.exports = mongoose.model('user', UserSchema);