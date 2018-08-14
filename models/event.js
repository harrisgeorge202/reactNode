
var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Event = new Schema({
    name: String,
    admin: String,
    tag: String,
    description: String

});

module.exports = mongoose.model('event', Event);