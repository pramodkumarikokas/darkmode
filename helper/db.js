const mongoose = require('mongoose');

module.exports = () => {
    mongoose.connect('mongodb://localhost/dark_mode', {useNewUrlParser:true});
    mongoose.connection.on('open', () => {
        console.log('MongoDb check: Connected');
    });
    mongoose.connection.on('error', (err) => {
        console.log('MongoDb: Error', err);
    });
    mongoose.Promise=global.Promise;
};