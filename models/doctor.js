var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DoctorSchema = new Schema({
  nombre: { type: String, required: true },
  especialidad: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
});

module.exports = mongoose.model('Doctor', DoctorSchema);
