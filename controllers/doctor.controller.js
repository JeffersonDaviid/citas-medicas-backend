var Doctor = require('../models/doctor.js');
var controller = {
  getDoctores: async function (req, res) {
    try {
      const doctores = await Doctor.find({}).sort();
      if (doctores.length === 0) {
        return res.status(404).send({ message: 'No hay doctores' });
      }
      return res.status(200).send({ doctores });
    } catch (error) {
      return res.status(500).send({ message: 'Error al recuperar los datos' });
    }
  },

  saveDoctor: async function (req, res) {
    try {
      var doctor = new Doctor();
      var params = req.body;
      doctor.nombre = params.nombre;
      doctor.especialidad = params.especialidad;
      doctor.horarioDisponibilidad = params.horarioDisponibilidad;

      var doctorStored = await doctor.save();
      if (!doctorStored) {
        return res.status(404).send({ message: 'No se guardó el doctor' });
      }
      return res.status(201).send({ doctor: doctorStored });
    } catch (error) {
      return res.status(500).send({ message: 'Error al guardar los datos' });
    }
  },

  getDoctor: async function (req, res) {
    try {
      var doctorId = req.params.id;
      if (!doctorId) return res.status(404).send({ message: 'El doctor no existe' });
      var doctor = await Doctor.findById(doctorId);
      if (!doctor) return res.status(404).send({ message: 'El doctor no existe' });
      return res.status(200).send({ doctor });
    } catch (error) {
      return res.status(500).send({ message: 'Error al recuperar los datos' });
    }
  },

  updateDoctor: async function (req, res) {
    try {
      var doctorId = req.params.id;
      var update = req.body;

      var doctorUpdate = await Doctor.findByIdAndUpdate(doctorId, update, { new: true });
      if (!doctorUpdate)
        return res.status(404).send({ message: 'El doctor no se ha actualizado' });
      return res.status(200).send({ doctor: doctorUpdate });
    } catch (error) {
      return res.status(500).send({ message: 'Error al actualizar los datos' });
    }
  },

  deleteDoctor: async function (req, res) {
    try {
      var doctorId = req.params.id;
      var doctorRemoved = await Doctor.findByIdAndDelete(doctorId);
      if (!doctorRemoved)
        return res.status(404).send({ message: 'El doctor no se puede eliminar' });
      return res.status(200).send({ doctorRemoved });
    } catch (error) {
      return res.status(500).send({ message: 'Error al eliminar los datos' });
    }
  },
};
module.exports = controller;