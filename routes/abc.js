var express = require('express');
var app = express();
var router = express.Router();
var abc = require('../models/abc');
// var ValidationController = require('./../controller/Validation')
var abcController = require('./../controller/abc');

router.post('/register', abcController.insert);
router.post('/login', abcController.login);


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