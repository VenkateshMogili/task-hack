const express = require('express');
const router = express.Router();
const db = require('../db');


/* GET users listing. */
router.get('/', function(req, res, next) {
  db.query("SELECT * FROM users",(err,row,fields)=>{
    if(err) res.send({success:false,message:"Error"})
    if(row.length>0){
    res.send({success:true,data:row,message:"Success"})
    } else{
      res.send({success:false,message:"No data found!"})
    }
  });
});

module.exports = router;
