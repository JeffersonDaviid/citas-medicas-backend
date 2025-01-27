const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Se almacenará en texto plano
  cedula: { type: String, required: true, unique: true },
  fechaNacimiento: { type: Date, required: true },
  telefono: { type: String, required: true },
  securityQuestion: { type: String, required: true },
  securityAnswer: { type: String, required: true }, // Se almacenará en texto plano
  fechaRegistro: { type: Date, default: Date.now },
});

// Método para comparar la contraseña directamente en texto plano
UsuarioSchema.methods.comparePassword = function (candidatePassword) {
  return candidatePassword === this.password;
};

module.exports = mongoose.model('Usuario', UsuarioSchema);
