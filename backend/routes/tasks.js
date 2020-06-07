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
      let userid;
      db.query("SELECT * FROM users WHERE email=?",[authData.user.email],(err,row,fields)=>{
        if(err) res.send({success:false,message:"Error"})
        else if(row.length>0){
          userid = row[0].id;
          db.query("SELECT * FROM tasks where active=1 and created_by=? ORDER BY id DESC",[userid],(err,row,fields)=>{
            if(err) res.send({success:false,message:"Error"})
            else if(row.length>0){
              let sun = row.filter((r)=> new Date(r.deadline_date).getDay()==0 && r.status==2);
              let mon = row.filter((r)=> new Date(r.deadline_date).getDay()==1 && r.status==2);
              let tue = row.filter((r)=> new Date(r.deadline_date).getDay()==2 && r.status==2);
              let wed = row.filter((r)=> new Date(r.deadline_date).getDay()==3 && r.status==2);
              let thu = row.filter((r)=> new Date(r.deadline_date).getDay()==4 && r.status==2);
              let fri = row.filter((r)=> new Date(r.deadline_date).getDay()==5 && r.status==2);
              let sat = row.filter((r)=> new Date(r.deadline_date).getDay()==6 && r.status==2);
              const data = [mon.length,tue.length,wed.length,thu.length,fri.length,sat.length,sun.length];
              let completed = {data, label:'Completed',stack:'a'}
              let sun1 = row.filter((r)=> new Date(r.deadline_date).getDay()==0 && r.status==1);
              let mon1 = row.filter((r)=> new Date(r.deadline_date).getDay()==1 && r.status==1);
              let tue1 = row.filter((r)=> new Date(r.deadline_date).getDay()==2 && r.status==1);
              let wed1 = row.filter((r)=> new Date(r.deadline_date).getDay()==3 && r.status==1);
              let thu1 = row.filter((r)=> new Date(r.deadline_date).getDay()==4 && r.status==1);
              let fri1 = row.filter((r)=> new Date(r.deadline_date).getDay()==5 && r.status==1);
              let sat1 = row.filter((r)=> new Date(r.deadline_date).getDay()==6 && r.status==1);
              const data2 = [mon1.length,tue1.length,wed1.length,thu1.length,fri1.length,sat1.length,sun1.length];
              let inprogress = {data:data2, label:'In Progress',stack:'a'}
              let sun2 = row.filter((r)=> new Date(r.deadline_date).getDay()==0 && r.status==0);
              let mon2 = row.filter((r)=> new Date(r.deadline_date).getDay()==1 && r.status==0);
              let tue2 = row.filter((r)=> new Date(r.deadline_date).getDay()==2 && r.status==0);
              let wed2 = row.filter((r)=> new Date(r.deadline_date).getDay()==3 && r.status==0);
              let thu2 = row.filter((r)=> new Date(r.deadline_date).getDay()==4 && r.status==0);
              let fri2 = row.filter((r)=> new Date(r.deadline_date).getDay()==5 && r.status==0);
              let sat2 = row.filter((r)=> new Date(r.deadline_date).getDay()==6 && r.status==0);
              const data3 = [mon2.length,tue2.length,wed2.length,thu2.length,fri2.length,sat2.length,sun2.length];
              let newtasks = {data:data3, label:'New',stack:'a'}
              const finalData =[completed,inprogress,newtasks];
              res.send({success:true,data:finalData,tasklist:row,message:"Success"});
            } else{
              res.send({success:false,message:"No task found!"});
            }
          });
        }else{
          res.send({success:false,message:"No user found!"});
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
      let userid;
      db.query("SELECT * FROM users WHERE email=?",[authData.user.email],(err,row,fields)=>{
        if(err) res.send({success:false,message:"Error"})
        else if(row.length>0){
          userid = row[0].id;
          db.query("SELECT * FROM tasks WHERE id=? and created_by=?",[id,userid],(err,row,fields)=>{
            if(err) res.send({success:false,message:"Error"})
            if(row.length>0){
            res.send({success:true,data:row,message:"Success"});
            } else{
              res.send({success:false,message:"No task found!"});
            }
          });
        } else{
          res.send({success:false,message:"No user found!"});
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
      const today = new Date();
      let userid;
      db.query("SELECT * FROM users WHERE email=?",[authData.user.email],(err,row,fields)=>{
        if(err) res.send({success:false,message:"Error"})
        else if(row.length>0){
          userid = row[0].id;
          const task = {
            task_name: data.task_name,
            deadline_date: data.deadline_date,
            deadline_time: data.deadline_time,
            label: data.label,
            created_by: userid
          }
          db.query("INSERT INTO tasks SET ?",[task],(err,row)=>{
            if(err) res.send({success:false,message:err});
            res.send({success: true,message:"Task created successfully"});
          });
        } else{
          res.send({success:false,message:"No user found!"});
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
  const bearerHeader = req.headers['token'];
  if(typeof bearerHeader!=='undefined'){
    req.token = bearerHeader;
    next();
  } else{
    res.send({success: false,status:'Token verification failed'});
  }
}

module.exports = router;
