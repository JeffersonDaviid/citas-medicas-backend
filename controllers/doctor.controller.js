var Doctor = require('../models/doctor.js');
var HorarioDisponibilidad = require('../models/horario-disponibilidad.js');
var moment = require('moment'); // Asegúrate de tener moment.js instalado


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
      doctor.correo = params.correo;
      doctor.contrasena = params.contrasena;

      var doctorStored = await doctor.save();
      if (!doctorStored) {
        return res.status(404).send({ message: 'No se guardó el doctor' });
      }

      // Generar horarios disponibles
      const horarios = generateHorariosDisponibles(doctorStored._id, new Date(), 30);
      await HorarioDisponibilidad.insertMany(horarios);

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


function generateHorariosDisponibles(doctorId, startDate, interval) {
  let horarios = [];
  let currentDay = moment(startDate);

  // Si es sábado (6) o domingo (0), mover al próximo lunes
  if (currentDay.day() === 6) {
    currentDay.add(2, 'days');
  } else if (currentDay.day() === 0) {
    currentDay.add(1, 'days');
  }

  // Generar horarios de lunes a viernes
  for (let i = 0; i < 10; i++) {
    let dayStart = currentDay.clone().startOf('day').add(8, 'hours'); // Comienza a las 8 AM
    let dayEnd = currentDay.clone().startOf('day').add(17, 'hours'); // Termina a las 5 PM

    while (dayStart.isBefore(dayEnd)) {
      horarios.push({
        doctor: doctorId,
        dia: currentDay.format('YYYY-MM-DD'),
        hora: dayStart.format('HH:mm'),
        estado: 'disponible'
      });
      dayStart.add(interval, 'minutes');
    }

    currentDay.add(1, 'days');
  }

  return horarios;
}

module.exports = controller;
