const express = require('express');
const jwt = require('jsonwebtoken');
const passwordHash = require('password-hash');
const multer = require("multer");
const fs = require("fs");
const router = express.Router();
const db = require('../db');

const date = new Date().getFullYear()+""+new Date().getMonth()+""+new Date().getDate()+"_"+new Date().getTime();
const storage = multer.diskStorage({
  destination: (req,file,callBack)=>{
    callBack(null,'public/profiles');
  },
  filename: (req,file,callBack)=>{
    callBack(null,date+"_"+file.originalname);
  }
});

const upload = multer({storage: storage});


/* GET users listing. */
router.get('/', verifyToken, function(req, res, next) {
  jwt.verify(req.token,'secretkey',(err,authData)=>{
    if(err){
      res.sendStatus(403);
    } else{
      db.query("SELECT * FROM users",(err,row,fields)=>{
        if(err) res.send({success:false,message:"Error"})
        if(row.length>0){
        res.send({success:true,data:row,message:"Success",authData})
        } else{
          res.send({success:false,message:"No data found!"})
        }
      });
    }
  })

});

router.post('/login', function(req, res, next) {
  const data = req.body;
  const user = {
    email: data.email,
    password: data.password
  }

  db.query("SELECT * FROM users WHERE email=?",[user.email],(err,row,fields)=>{
    if(err) res.send({success:false,message:"Error"})
    if(row.length>0){
    if(passwordHash.verify(user.password, row[0].password)){
      jwt.sign({user},'secretkey',{expiresIn:'1 day'},(err,token)=>{
        res.json({
          success:true,
          username: row[0].username,
          profile_pic: row[0].profile_pic,
          token
        });
      });
    } else{
      res.send({success:false,message:"Invalid credentials!"})
    }
    } else{
      res.send({success:false,message:"User not found!"})
    }
  });
});

router.post('/signup', function(req, res, next) {
  const data = req.body;
  const passwordPlain = data.password;
  const user = {
    username: data.name,
    email: data.email,
    password: passwordHash.generate(data.password)
  }
  db.query("SELECT * FROM users WHERE email=?",[user.email],(err,rows)=>{
    if(err) res.send({success: false,message:err});
    else if(rows.length>0){
      res.send({success: false,message:"Already registered"});
    } else{
      db.query("INSERT INTO users SET ?",[user],(err,row)=>{
        if(err) res.send({success:false,message:err});
        db.query("SELECT * FROM users WHERE email=?",[user.email],(err,row,fields)=>{
          if(err) res.send({success:false,message:"Error"})
          if(row.length>0){
          if(passwordHash.verify(passwordPlain, row[0].password)){
            jwt.sign({user},'secretkey',{expiresIn:'1 day'},(err,token)=>{
              res.json({
                success:true,
                username: row[0].username,
                profile_pic: row[0].profile_pic,
                token
              });
            });
          } else{
            res.send({success:false,message:"Invalid credentials!"})
          }
          } else{
            res.send({success:false,message:"User not found!"})
          }
        });
      });
    }
  })
});

router.put('/update/:user_id',verifyToken, function(req, res, next) {
  jwt.verify(req.token,'secretkey',(err,authData)=>{
    if(err){
      res.sendStatus(403);
    } else{
      const id= req.params.user_id;
      const user = req.body;
      db.query("SELECT * FROM users WHERE id=?",[id],(err,rows)=>{
        if(err) res.send({success: false,message:err});
        else if(rows.length>0){
          db.query("UPDATE users SET ? WHERE id=?",[user,id],(err,row)=>{
            if(err) res.send({success:false,message:err});
            res.send({success: true,message:"User updated successfully"});
          });
        } else{
          res.send({success: false,message:"User not found!"});
        }
      });
    }
  });
});



router.post("/profile",verifyToken,upload.single('upload'),(req,res,next)=>{
  jwt.verify(req.token,'secretkey',(err,authData)=>{
    if(err){
      res.sendStatus(403);
    } else{
      const file = req.file;
      if(!file)
      {
        let result = {"error": {
          "message": "The image upload failed because the image was too big (max 1.5MB)."
          }
        }
        res.send(result);
      }
      const email = authData.user.email;
      const user = {profile_pic:file.filename};
      db.query("SELECT * FROM users WHERE email=?",[email],(err,row,fields)=>{
        if(err) res.send({success:false,message:"Error"})
        if(row.length>0){
          const id = row[0].id;
          db.query("UPDATE users SET ? WHERE id=?",[user,id],(err,row)=>{
            if(err) res.send({success:false,message:err});
            res.send({success: true,message:"User profile updated successfully"});
          });
        } else{
          res.send({success:false,message:"No data found!"})
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
    res.sendStatus(403);
  }
}

module.exports = router;
