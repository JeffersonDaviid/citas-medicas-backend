var mongoose = require('mongoose')
var Schema = mongoose.Schema

var DoctorSchema = new Schema({
    nombre: String,
    especialidad: String,
});
module.exports = mongoose.model('Doctor', DoctorSchema)