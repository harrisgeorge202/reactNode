var mongoose = require('mongoose');

var abcDB = mongoose.model('abc');
var eventModel = mongoose.model('event');


module.exports = {
    insert: function(req, res) {
         console.log("req =========================>>>>>>>>>>>>>>", req.body)
if(req.body.username && req.body.email_id && req.body.password) {
         
        var abcObj = new abcDB({
            username    : req.body.username,
            email_id      : req.body.email_id,
            password      : req.body.password
        })
        abcObj.save(function(err) {
            if(err) {
                return res.status(500).json({ status: false, message: 'Database error'})
            } else {
                 console.log("actionObj =================>>>>>>>>>>>>>>>>>", abcObj)
                return res.status(200).json({ status: true, data:abcObj })
                // res.send("Name saved to database");
            }
        })
    } else {
        return res.status(500).json({ status: false, message: 'Error. Insert all elements'})        
    }
    },

    login: function(req, res) {
        console.log("req.body ===================>>>>>>>>>>>>>>>", req.body)
        abcDB.findOne({ username: req.body.username, password: req.body.password})
        .exec(function(err, actions) {
            if(err) {
                return res.status(500).json({ status: false, message: 'Database error'})
            }
            if(actions) {
                console.log("Call back ========================>>>>>>>>>>>>", actions)
                return res.status(200).json({ status: true, data: actions})
            } else {
                return res.status(500).json({ status: false, message: 'No details found'})
                
            }
        })
    },


    
    eventCreate: async function (req, res, next) {
        try {
             console.log("create event ", req.body);
            if (req.body.username) {
                // abcDB.findOne({ username: req.body.username, password: req.body.password})

                    var user = await abcDB.findOne({ username: req.body.username  })
                    console.log("USERRRRRRRRRR", user)
                    if (!user)
                        throw new Error('No user found.');
                    if (user) {
                        var event = await eventModel.create({
                            name: req.body.name,
                            admin: user.id,
                            tag: req.body.tag,
                            description: req.body.description
                        })
  
                        return res.status(200).json({ status: true, event: event });
                    }
            }
            if (!req.body.name)
                throw new Error('No name found.');
        } catch (err) {
            console.log("Error", err.message)
            return res.status(400).json({ status: false, message: err.message })
        }
    },




    eventUpdate: async function (req, res, next) {
        try {
            var data = await eventModel.find({  id: req.body.id  })
            console.log("dataaaaaaaa", data)
            if (data) {
                var update = await eventModel.findOneAndUpdate({_id: req.body.id,}, 
        { $set: { name: req.body.name ,tag: req.body.tag ,description: req.body.description } },{new:true},
                
        function (err, rule) {
            if (err) {return res.status(400).json(err)} 
            else {
                return res.status(200).json({ event: rule });
            }
        })
    }
            if (!data) {
                throw new Error('No data provided.');
            }
        } catch (err) {
            console.log("Error", err.message)
            return res.status(400).json({ status: false, message: err.message })
        }
    },





    eventDelete: async function (req, res, next) {
        try {

            var user = await abcDB.findOne({_id: req.body.id  })
                if (!user)
                    throw new Error('No user found.');
                if (user) {
                    console.log("userrrrrrrrrrrrrrrr", user)
                    var allEvents = await eventModel.findOne({  admin: user._id  }).remove(function (err, rule) {
                        if (err) {
                            return res.status(400).json({ status: false, message: 'Databse error', data: err })
                        } 
                        else 
                        {
                            return res.status(200).json({ status: true, events: allEvents })
                        }
                    })
                }
        } catch (err) {
            console.log("Error", err.message)
            return res.status(400).json({ status: false, message: err.message })
        }
    },












    eventList: async function (req, res, next) {
        try {
console.log("222222222222222222222222")
            var user = await abcDB.findOne({ _id: req.params.user_id})

            console.log("1111111111111111111111111111")

                if (!user)
                    throw new Error('No user found.');
                if (user) {
                    console.log("userrrrrrrrrrrrrrrr", user)
                    var allEvents = await eventModel.find({  admin: user._id  })
                    return res.status(200).json({ status: true, events: allEvents });
                }
        } catch (err) {
            console.log("Error", err.message)
            return res.status(400).json({ status: false, message: err.message })
        }
    },

















    

    select: function(req, res) {
        // console.log("Enter select actions ===================>>>>>>>>>>>>>>>")
        abcDB.find()
        .exec(function(err, actions) {
            if(err) {
                return res.status(500).json({ status: false, message: 'Database error'})
            } else {
                // console.log("actions selected ========================>>>>>>>>>>>>")
                // console.log(actions)
                return res.status(200).json({ status: true, data : actions})
            }
        })
    },



    
    update: function(req, res) {
        abcDB.findOneAndUpdate({_id: req.params.abc_id,}, 
            { $set: { first_name: req.body.fname ,last_name: req.body.lname ,email_id: req.body.email ,password: req.body.pass} },{new:true},
            function (err, rule) {
                if (err) {return res.status(400).json(err)} 
                else {
                    return res.status(200).json({status: true,message: "Id updated",data: rule})
                }
            })
        },
    
    remove: function (req, res) {
        // console.log("enter inside delete =============>>>>>>>>")
        // console.log("req.params :::::::::::::::::")
        // console.log(req.params)
        abcDB.findOne({ _id: req.params.abc_id }).remove(function (err, rule) {
                if (err) {
                    return res.status(400).json({ status: false, message: 'Databse error', data: err })
                } 
                else 
                {
                    return res.status(200).json({ status: true, message: 'Id Removed' })
                }
            })
        }

}
    
