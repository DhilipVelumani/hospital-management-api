var mongoose = require('mongoose');

const mongoURI = "mongodb://127.0.0.1:27017/HospitalManagement";
mongoose.connect(mongoURI);
const conn = mongoose.createConnection(mongoURI);


module.exports = conn;