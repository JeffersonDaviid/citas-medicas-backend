var HorarioDisponibilidad = require('../models/horario-disponibilidad.js');
var controller = {
  getHorarios: async function (req, res) {
    try {
      const horarios = await HorarioDisponibilidad.find({}).sort();
      if (horarios.length === 0) {
        return res.status(404).send({ message: 'No hay horarios disponibles' });
      }
      return res.status(200).send({ horarios });
    } catch (error) {
      return res.status(500).send({ message: 'Error al recuperar los datos' });
    }
  },

  saveHorario: async function (req, res) {
    try {
      var horario = new HorarioDisponibilidad();
      var params = req.body;
      horario.doctor = params.doctor;
      horario.dia = params.dia;
      horario.horas = params.horas;

      var horarioStored = await horario.save();
      if (!horarioStored) {
        return res.status(404).send({ message: 'No se guardó el horario' });
      }
      return res.status(201).send({ horario: horarioStored });
    } catch (error) {
      return res.status(500).send({ message: 'Error al guardar los datos' });
    }
  },

  getHorario: async function (req, res) {
    try {
      var horarioId = req.params.id;
      if (!horarioId) return res.status(404).send({ message: 'El horario no existe' });
      var horario = await HorarioDisponibilidad.findById(horarioId);
      if (!horario) return res.status(404).send({ message: 'El horario no existe' });
      return res.status(200).send({ horario });
    } catch (error) {
      return res.status(500).send({ message: 'Error al recuperar los datos' });
    }
  },

  updateHorario: async function (req, res) {
    try {
      var horarioId = req.params.id;
      var update = req.body;

      var horarioUpdate = await HorarioDisponibilidad.findByIdAndUpdate(horarioId, update, { new: true });
      if (!horarioUpdate)
        return res.status(404).send({ message: 'El horario no se ha actualizado' });
      return res.status(200).send({ horario: horarioUpdate });
    } catch (error) {
      return res.status(500).send({ message: 'Error al actualizar los datos' });
    }
  },

  deleteHorario: async function (req, res) {
    try {
      var horarioId = req.params.id;
      var horarioRemoved = await HorarioDisponibilidad.findByIdAndDelete(horarioId);
      if (!horarioRemoved)
        return res.status(404).send({ message: 'El horario no se puede eliminar' });
      return res.status(200).send({ horarioRemoved });
    } catch (error) {
      return res.status(500).send({ message: 'Error al eliminar los datos' });
    }
  },
};
module.exports = controller;