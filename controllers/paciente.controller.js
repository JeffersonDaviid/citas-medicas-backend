var Paciente = require('../models/paciente.js');
var controller = {
  getPacientes: async function (req, res) {
    try {
      const pacientes = await Paciente.find({}).sort();
      if (pacientes.length === 0) {
        return res.status(404).send({ message: 'No hay pacientes' });
      }
      return res.status(200).send({ pacientes });
    } catch (error) {
      return res.status(500).send({ message: 'Error al recuperar los datos' });
    }
  },

  savePaciente: async function (req, res) {
    try {
      var paciente = new Paciente();
      var params = req.body;
      paciente.nombre = params.nombre;
      paciente.correo = params.correo;
      paciente.contrasena = params.contrasena;

      var pacienteStored = await paciente.save();
      if (!pacienteStored) {
        return res.status(404).send({ message: 'No se guardó el paciente' });
      }
      return res.status(201).send({ paciente: pacienteStored });
    } catch (error) {
      return res.status(500).send({ message: 'Error al guardar los datos' });
    }
  },

  getPaciente: async function (req, res) {
    try {
      var pacienteId = req.params.id;
      if (!pacienteId) return res.status(404).send({ message: 'El paciente no existe' });
      var paciente = await Paciente.findById(pacienteId);
      if (!paciente) return res.status(404).send({ message: 'El paciente no existe' });
      return res.status(200).send({ paciente });
    } catch (error) {
      return res.status(500).send({ message: 'Error al recuperar los datos' });
    }
  },

  updatePaciente: async function (req, res) {
    try {
      var pacienteId = req.params.id;
      var update = req.body;

      var pacienteUpdate = await Paciente.findByIdAndUpdate(pacienteId, update, { new: true });
      if (!pacienteUpdate)
        return res.status(404).send({ message: 'El paciente no se ha actualizado' });
      return res.status(200).send({ paciente: pacienteUpdate });
    } catch (error) {
      return res.status(500).send({ message: 'Error al actualizar los datos' });
    }
  },

  deletePaciente: async function (req, res) {
    try {
      var pacienteId = req.params.id;
      var pacienteRemoved = await Paciente.findByIdAndDelete(pacienteId);
      if (!pacienteRemoved)
        return res.status(404).send({ message: 'El paciente no se puede eliminar' });
      return res.status(200).send({ pacienteRemoved });
    } catch (error) {
      return res.status(500).send({ message: 'Error al eliminar los datos' });
    }
  },
};
module.exports = controller;