var mongoose = require('mongoose');

var gamelogSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    record: String,
    time: String
});

var Gamelog = mongoose.model('Gamelog', gamelogSchema);

module.exports = Gamelog;
