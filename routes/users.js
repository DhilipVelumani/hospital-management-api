
var express = require('express');
var router = express.Router();

var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

var User = require('../model/user');

var conn = require('../mongoConnection');
/* GET users listing. */
router.get('/', function(req, res, next) {
    // var decoded = jwt.decode(req.header('Authorization'));        
    // if(!decoded){
    //     return res.status(401).json({
    //         title: 'Not Authenticated',
    //         error: {message: 'Invalid Token!'}
    //     });
    // } 
   User.find({}, function(err, users) {
      if (err) {
          return res.status(500).json({
              title: 'An error occurred',
              error: err
          });
      }
      res.status(200).json({
          data: users
      });
  });
  
});


router.post('/', function (req, res, next) {   
    var user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: bcrypt.hashSync(req.body.password, 10),
        email: req.body.email,
        userType: req.body.userType,
		gender: req.body.gender,
		mobNum: req.body.mobNum,
		dob: new Date(req.body.dob)
    });
    User.findOne({email: user.email}, function(err, result) {
        if(err){
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        if(!result){            
            user.save(function(err, result1) {
                if (err) {
                    return res.status(500).json({
                        title: 'An error occurred',
                        error: err
                    });
                }
                return res.status(201).json({
                    message: 'User created',
                    obj: result1
                });
            });
        }
        else{
            return res.status(500).json({
                error:{
                    message: 'User already exists'
                }
            });
        }
    });
});

router.post('/login', function(req, res, next) {
    console.log('in login method: ',req.header('Content-Type'));
    User.findOne({email: req.body.email}, function(err, user) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!user) {
            return res.status(401).json({
                title: 'Login failed',
                error: {message: 'Invalid login credentials'}
            });
        }
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(401).json({
                title: 'Login failed',
                error: {message: 'Invalid login credentials'}
            });
        }
        
        token = jwt.sign({user: user}, 'secret', {expiresIn: 7200});
        console.log('-------------signed in----------------------');
        
        res.status(200).json({
            message: 'Successfully logged in',
            token: token
        });        
    });
});

module.exports = router;
