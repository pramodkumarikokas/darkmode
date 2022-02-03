const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlacklistTokenSchema = new Schema({
    mobile: String,
    token: String,
    createdAt:{ type: Date, default: Date.now }
});
module.exports = mongoose.model('blacklist', BlacklistTokenSchema);