var express = require('express');
var app = express();
var router = express.Router();


var userModel = require('../models/user');
var abc = require('../models/abc');
var event = require('../models/event');

// var ValidationController = require('./../controller/Validation')
var abcController = require('./../controller/abc');

router.post('/register', abcController.insert);
router.post('/login', abcController.login);




router.post('/event/create', abcController.eventCreate);
router.post('/event/update', abcController.eventUpdate);
router.post('/event/delete', abcController.eventDelete);
router.get('/event/list', abcController.eventList);




// router.get('/eventlist/:user_id', abcController.eventList);





router.post("/addname", (req, res) => {
  var myData = new abc(req.body);
  myData.save()
      .then(item => {
          res.send("Name saved to database");
      })
      .catch(err => {
          res.status(400).send("Unable to save to database");
      });
});

 router.get('/', abcController.select);
 
router.put('/:abc_id', abcController.update);

 router.delete('/:abc_id', abcController.remove);

// router.put('/:rule_id/status', IotRulesController.updateActiveStatus);
// router.put('/:rule_id', ValidationController.isValidRuleName,
//                       IotRulesController.updateRule)
// router.delete('/:rule_id', IotRulesController.removeRule);

module.exports = router;