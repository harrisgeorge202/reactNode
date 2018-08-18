var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

    var User = new Schema({
        username    : String,
        email      : String,
        password      : String,
        auth_token : String,
        
        
        first_name : String,
        last_name : String,
        profile_pic : String,
        social_media : String
        // age           : { type: Number,default:23 }
        
    });
    
    module.exports = mongoose.model('user', User);