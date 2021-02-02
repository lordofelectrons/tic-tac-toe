var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    login: String,
    password: String,
    avatar: String
});

var User = mongoose.model('User', userSchema);

module.exports = User;
