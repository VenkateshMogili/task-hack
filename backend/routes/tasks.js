const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../db');


/* GET all tasks listing. */
router.get('/', verifyToken, function(req, res, next) {
  jwt.verify(req.token,'secretkey',(err,authData)=>{
    if(err){
      res.sendStatus(403);
    } else{
      db.query("SELECT * FROM tasks",(err,row,fields)=>{
        if(err) res.send({success:false,message:"Error"})
        if(row.length>0){
        res.send({success:true,data:row,message:"Success"});
        } else{
          res.send({success:false,message:"No task found!"});
        }
      });
    }
  });
});

router.get('/:task_id', verifyToken, function(req, res, next) {
  jwt.verify(req.token,'secretkey',(err,authData)=>{
    if(err){
      res.sendStatus(403);
    } else{
      const id = req.params.task_id;
      db.query("SELECT * FROM tasks WHERE id=?",[id],(err,row,fields)=>{
        if(err) res.send({success:false,message:"Error"})
        if(row.length>0){
        res.send({success:true,data:row,message:"Success"});
        } else{
          res.send({success:false,message:"No task found!"});
        }
      });
    }
  });
});

router.post('/create',verifyToken, function(req, res, next) {
  jwt.verify(req.token,'secretkey',(err,authData)=>{
    if(err){
      res.sendStatus(403);
    } else{
      const data = req.body;
      const task = {
        task_name: data.task_name,
        deadline_date: data.deadline_date,
        deadline_time: data.deadline_time,
        label: data.label
      }
      db.query("SELECT * FROM tasks WHERE task_name=?",[task.task_name],(err,rows)=>{
        if(err) res.send({success: false,message:err});
        else if(rows.length>0){
          res.send({success: false,message:"Duplicate task found!"});
        } else{
          db.query("INSERT INTO tasks SET ?",[task],(err,row)=>{
            if(err) res.send({success:false,message:err});
            res.send({success: true,message:"Task created successfully"});
          });
        }
      });
    }
  });
});

router.put('/update/:task_id',verifyToken, function(req, res, next) {
  jwt.verify(req.token,'secretkey',(err,authData)=>{
    if(err){
      res.sendStatus(403);
    } else{
      const id= req.params.task_id;
      const task = req.body;
      db.query("SELECT * FROM tasks WHERE id=?",[id],(err,rows)=>{
        if(err) res.send({success: false,message:err});
        else if(rows.length>0){
          db.query("UPDATE tasks SET ? WHERE id=?",[task,id],(err,row)=>{
            if(err) res.send({success:false,message:err});
            res.send({success: true,message:"Task updated successfully"});
          });
        } else{
          res.send({success: false,message:"Task not found!"});
        }
      });
    }
  });
});

router.delete('/delete/:task_id',verifyToken, function(req, res, next) {
  jwt.verify(req.token,'secretkey',(err,authData)=>{
    if(err){
      res.sendStatus(403);
    } else{
      const id= req.params.task_id;
      const task = {active:0};
      db.query("SELECT * FROM tasks WHERE id=? AND active=1",[id],(err,rows)=>{
        if(err) res.send({success: false,message:err});
        else if(rows.length>0){
          db.query("UPDATE tasks SET ? WHERE id=?",[task,id],(err,row)=>{
            if(err) res.send({success:false,message:err});
            res.send({success: true,message:"Task deleted successfully"});
          });
        } else{
          res.send({success: false,message:"Task not found!"});
        }
      });
    }
  });
});

function verifyToken(req,res,next){
  const bearerHeader = req.headers['authorization'];
  if(typeof bearerHeader!=='undefined'){
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else{
    res.send({success: false,status:'Token verification failed'});
  }
}

module.exports = router;
