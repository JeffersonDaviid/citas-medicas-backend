var Horario = require('../models/HorarioDisponibilidad.js');

var controller = {
	inicio: function (req, res) {
		return res.status(200).send({ message: '<h1>BIENVENIDOS A GESTIÓN DE HORARIOS</h1>' });
	},

	getHorarios: async function (req, res) {
		try {
			const horarios = await Horario.find({}).sort();
			if (horarios.length === 0) {
				return res.status(404).send({ message: 'No hay horarios disponibles' });
			}
			return res.status(200).send({ horarios });
		} catch (error) {
			return res.status(500).send({ message: 'Error al recuperar los datos' });
		}
	},

	getHorario: async function (req, res) {
		try {
			const { doctor, fechaInicio, fechaFin } = req.query;

			if (!doctor || !fechaInicio || !fechaFin) {
				return res.status(400).send({ message: "Se requiere doctor y fecha" });
			}

			const horarios = await Horario.find({
				doctor: doctor,
				fecha: { $gte: fechaInicio, $lte: fechaFin } 
			}).sort({ fecha: 1, hora: 1 }); 
	
			if (!horarios.length) {
				return res.status(404).send({ message: "No hay horarios disponibles para este doctor en la fecha seleccionada" });
			}

			return res.status(200).send({ horarios });
		} catch (error) {
			console.error(" Error en getHorario:", error);
			return res.status(500).send({ message: "Error al recuperar los datos" });
		}
	},

	getDoctores: async function (req, res) {
        try {
            const doctores = await Horario.distinct('doctor'); 
            if (!doctores.length) {
                return res.status(404).send({ message: "No hay doctores registrados" });
            }
            return res.status(200).send({ doctores });
        } catch (error) {
            return res.status(500).send({ message: "Error al obtener los doctores" });
        }
    }

};

module.exports = controller;
