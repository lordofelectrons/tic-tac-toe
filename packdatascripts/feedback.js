var mongoose = require('mongoose');

var feedbackSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    organization: String,
    type: String,
    message: String,
    picture: String
});

var Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
