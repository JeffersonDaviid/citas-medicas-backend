const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario')
const Doctor = require('../models/doctor')

const authMiddleware = async (req, res, next) => {
	try {
		const authHeader = req.header('Authorization')
		if (!authHeader) {
			return res.status(401).send({ error: 'No autorizado: No se proporcionó un token' })
		}

		const token = authHeader.replace('Bearer ', '')
		const decoded = jwt.verify(token, 'secreto')
		const usuario =
			(await Usuario.findById(decoded.id)) || (await Doctor.findById(decoded.id))

		if (!usuario) {
			return res.status(401).send({ error: 'No autorizado: Usuario no encontrado.' })
		}

		req.user = usuario
		next()
	} catch (error) {
		if (error.name === 'JsonWebTokenError') {
			return res.status(401).send({ error: 'No autorizado: Token inválido' })
		}
		res.status(401).send({ error: 'No autorizado' })
	}
}

module.exports = authMiddleware
