var express = require('express');
var router = express.Router();

/* GET userlist. */

router.get('/gatewaylist' , function(req,res) {
  var db = req.db;
  var collection = db.get('gatewaylist');
  collection.find({},{}, function(e,docs){
    res.json(docs);
  });
});

/*
 * POST to adduser
 */
router.post('/addgateway', function(req, res) {
  var db = req.db;
  var collection = db.get('gatewaylist');
  collection.insert(req.body, function(err, result){
    res.send(
        (err === null) ? { msg: '' } : { msg: err}
    );
  });
});

/*
 * DELETE to delete user
 */
 router.delete('/deletegateway/:id', function(req,res) {
   var db = req.db;
   var collection = db.get('gatewaylist');
   var gatewayToDelete = req.params.id;
   collection.remove({'_id' : gatewayToDelete }, function(err) {
     res.send((err === null) ? {msg: ''} : {msg:'error: ' + err });
   });
 });


module.exports = router;
