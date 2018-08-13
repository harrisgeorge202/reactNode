
var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

    var Abc = new Schema({
        username    : String,
        email_id      : String,
        password      : String,
        // age           : { type: Number,default:23 }
        
    });
    
    module.exports = mongoose.model('abc', Abc);