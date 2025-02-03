var Doctor = require('../models/doctor.js');
var HorarioDisponibilidad = require('../models/horario-disponibilidad.js');
var moment = require('moment');

var controller = {
  loginDoctor: async function (req, res) {
    try {
      const { email, password } = req.body;

      const doctor = await Doctor.findOne({ email });
      if (!doctor) {
        return res.status(404).send({ message: 'Doctor no encontrado' });
      }

      if (password !== doctor.password) {
        return res.status(401).send({ message: 'Correo o contraseña incorrectos' });
      }

      return res.status(200).send({ message: 'Inicio de sesión exitoso', doctor });
    } catch (error) {
      return res.status(500).send({ message: 'Error al iniciar sesión', error });
    }
  },

  saveDoctor: async function (req, res) {
    try {
      const { nombre, especialidad, email, password } = req.body;

      if (!nombre || !especialidad || !email || !password) {
        return res.status(400).send({ message: 'Todos los campos son obligatorios' });
      }

      const doctor = new Doctor({ nombre, especialidad, email, password });
      const doctorStored = await doctor.save();
      if (!doctorStored) {
        return res.status(404).send({ message: 'No se guardó el doctor' });
      }

      const horarios = generateHorariosDisponibles(doctorStored._id, new Date(), 30);
      await HorarioDisponibilidad.insertMany(horarios);

      return res.status(201).send({ doctor: doctorStored });
    } catch (error) {
      return res.status(500).send({ message: 'Error al guardar los datos', error });
    }
  },

  getDoctores: async function (req, res) {
    try {
      const doctores = await Doctor.find({}).sort();
      if (doctores.length === 0) {
        return res.status(404).send({ message: 'No hay doctores' });
      }
      return res.status(200).send({ doctores });
    } catch (error) {
      return res.status(500).send({ message: 'Error al recuperar los datos', error });
    }
  },

  getDoctor: async function (req, res) {
    try {
      const doctorId = req.params.id;
      const doctor = await Doctor.findById(doctorId);
      if (!doctor) {
        return res.status(404).send({ message: 'El doctor no existe' });
      }
      return res.status(200).send({ doctor });
    } catch (error) {
      return res.status(500).send({ message: 'Error al recuperar los datos', error });
    }
  },

  updateDoctor: async function (req, res) {
    try {
      const doctorId = req.params.id;
      const update = req.body;
      const doctorUpdate = await Doctor.findByIdAndUpdate(doctorId, update, { new: true });
      if (!doctorUpdate) {
        return res.status(404).send({ message: 'El doctor no se ha actualizado' });
      }
      return res.status(200).send({ doctor: doctorUpdate });
    } catch (error) {
      return res.status(500).send({ message: 'Error al actualizar los datos', error });
    }
  },

  deleteDoctor: async function (req, res) {
    try {
      const doctorId = req.params.id;
      const doctorRemoved = await Doctor.findByIdAndDelete(doctorId);
      if (!doctorRemoved) {
        return res.status(404).send({ message: 'El doctor no se puede eliminar' });
      }
      return res.status(200).send({ doctorRemoved });
    } catch (error) {
      return res.status(500).send({ message: 'Error al eliminar los datos', error });
    }
  },
};

function generateHorariosDisponibles(doctorId, startDate, interval) {
  let horarios = [];
  let currentDay = moment(startDate);

  if (currentDay.day() === 6) {
    currentDay.add(2, 'days');
  } else if (currentDay.day() === 0) {
    currentDay.add(1, 'days');
  }

  for (let i = 0; i < 10; i++) {
    let dayStart = currentDay.clone().startOf('day').add(8, 'hours');
    let dayEnd = currentDay.clone().startOf('day').add(17, 'hours');

    while (dayStart.isBefore(dayEnd)) {
      horarios.push({
        doctor: doctorId,
        dia: currentDay.format('YYYY-MM-DD'),
        hora: dayStart.format('HH:mm'),
        estado: 'disponible',
      });
      dayStart.add(interval, 'minutes');
    }
    currentDay.add(1, 'days');
  }

  return horarios;
}

module.exports = controller;
