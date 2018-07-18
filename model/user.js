var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var userSchema = new Schema({
    firstName:  String,
    lastName:  String,
    email:  String,
    mobNum:  String,
    password: String,
	gender: String,
	dob: Date,
	userType: String
  });
  
userSchema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('User', userSchema);