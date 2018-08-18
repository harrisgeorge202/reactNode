var mongoose = require('mongoose');

var userModel = mongoose.model('user');
var abcDB = mongoose.model('abc');
var eventModel = mongoose.model('event');


var jwt = require('jsonwebtoken');
var config = require('.././config/config');


module.exports = {


    insert: async function (req, res, next) {
        try {
            console.log("-------------------req.body", req.body)
            if (req.body.username && req.body.email && req.body.password) {
                console.log("-------------------req.body.email", req.body.email)
                var user_details = await new userModel({
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    auth_token: req.body.auth_token,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    profile_pic: req.body.profile_pic,
                    social_media: req.body.social_media
                })
                if (user_details) {
                    console.log("-------------------user_details--", user_details)
                    var token = await jwt.sign({ email: user_details.email }, config.secret, {
                        // expiresIn: 86400 
                    })
                    console.log("token----------------->", token)

                    // var updateToken = await user_details.updateAttributes({ email: req.body.email },
                    // { $set: { auth_token: token } })

                    user_details.save(async function (err) {
                        if (err) {
                            return res.status(500).json({ status: false, message: 'Database error' })
                        } else {

                            var updateToken = await userModel.findOneAndUpdate({ _id: user_details._id, },
                                {
                                    $set: { auth_token: token }
                                })
                            console.log("updateToken----------------->", updateToken)

                            return res.status(200).json({ status: true, data: updateToken })
                            // res.send("Name saved to database");
                        }
                    })

                    // return res.status(200).json({ data: user_details });
                }
            } else {
                throw new Error('Email must be filled.');
            }
        } catch (err) {
            console.log("Error", err.message)
            return res.status(400).json({ status: false, message: err.message })
        }
    },








    // insert: function (req, res) {
    //     console.log("req =========================>>>>>>>>>>>>>>", req.body)
    //     if (req.body.username && req.body.email_id && req.body.password) {

    //         var abcObj = new abcDB({
    //             username: req.body.username,
    //             email_id: req.body.email_id,
    //             password: req.body.password
    //         })
    //         abcObj.save(function (err) {
    //             if (err) {
    //                 return res.status(500).json({ status: false, message: 'Database error' })
    //             } else {
    //                 console.log("actionObj =================>>>>>>>>>>>>>>>>>", abcObj)
    //                 return res.status(200).json({ status: true, data: abcObj })
    //                 // res.send("Name saved to database");
    //             }
    //         })
    //     } else {
    //         return res.status(500).json({ status: false, message: 'Error. Insert all elements' })
    //     }
    // },




    login: function (req, res) {
        console.log("req.body ===================>>>>>>>>>>>>>>>", req.body)
        userModel.findOne({ username: req.body.username, password: req.body.password })
            .exec(function (err, actions) {
                if (err) {
                    return res.status(500).json({ status: false, message: 'Database error' })
                }
                if (actions) {
                    console.log("Call back ========================>>>>>>>>>>>>", actions)
                    return res.status(200).json({ status: true, data: actions.auth_token })
                } else {
                    return res.status(500).json({ status: false, message: 'No details found' })

                }
            })
    },



    eventCreate: async function (req, res, next) {
        try {
            console.log("create event ", req.body);


            if (req.body.name) {

                var token = req.headers['x-access-token'];
                if (!token)
                    throw new Error('No token provided.');
                if (token) {
                    var decoded = await jwt.verify(token, config.secret)
                    console.log("decode-------------", token)
                    var user = await userModel.findOne({ auth_token: token })
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
            var data = await eventModel.find({ id: req.body.id })
            console.log("dataaaaaaaa", data)
            if (data) {
                var update = await eventModel.findOneAndUpdate({ _id: req.body.id, },
                    { $set: { name: req.body.name, tag: req.body.tag, description: req.body.description } }, { new: true },

                    function (err, rule) {
                        if (err) { return res.status(400).json(err) }
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

            var data = await eventModel.find({ id: req.body.id })
            console.log("dataaaaaaaa", data)
            if (data) {
                var delet = await eventModel.findOne({ _id: req.body.id, }).remove(

                    function (err, rule) {
                        if (err) { return res.status(400).json(err) }
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



    eventList: async function (req, res, next) {
        try {

            var token = req.headers['x-access-token'];
            if (!token)
                throw new Error('No token provided.');
            if (token) {
                var decoded = await jwt.verify(token, config.secret)
                console.log("decode-------------", token)
                var user = await userModel.findOne({ auth_token: token })
                console.log("USERRRRRRRRRR", user)
                if (!user)
                    throw new Error('No user found.');


            // var user = await abcDB.findOne({ _id: req.params.user_id })


            if (user) {
                console.log("userrrrrrrrrrrrrrrr", user)
                var allEvents = await eventModel.find({ admin: user._id })
                return res.status(200).json({ status: true, events: allEvents });
            }
        }
        } catch (err) {
            console.log("Error", err.message)
            return res.status(400).json({ status: false, message: err.message })
        }
    },



    // eventList: async function (req, res, next) {
    //     try {
    //         console.log("222222222222222222222222")
    //         var user = await abcDB.findOne({ _id: req.params.user_id })

    //         console.log("1111111111111111111111111111")

    //         if (!user)
    //             throw new Error('No user found.');
    //         if (user) {
    //             console.log("userrrrrrrrrrrrrrrr", user)
    //             var allEvents = await eventModel.find({ admin: user._id })
    //             return res.status(200).json({ status: true, events: allEvents });
    //         }
    //     } catch (err) {
    //         console.log("Error", err.message)
    //         return res.status(400).json({ status: false, message: err.message })
    //     }
    // },


    select: function (req, res) {
        // console.log("Enter select actions ===================>>>>>>>>>>>>>>>")
        abcDB.find()
            .exec(function (err, actions) {
                if (err) {
                    return res.status(500).json({ status: false, message: 'Database error' })
                } else {
                    // console.log("actions selected ========================>>>>>>>>>>>>")
                    // console.log(actions)
                    return res.status(200).json({ status: true, data: actions })
                }
            })
    },




    update: function (req, res) {
        abcDB.findOneAndUpdate({ _id: req.params.abc_id, },
            { $set: { first_name: req.body.fname, last_name: req.body.lname, email_id: req.body.email, password: req.body.pass } }, { new: true },
            function (err, rule) {
                if (err) { return res.status(400).json(err) }
                else {
                    return res.status(200).json({ status: true, message: "Id updated", data: rule })
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
            else {
                return res.status(200).json({ status: true, message: 'Id Removed' })
            }
        })
    }

}

