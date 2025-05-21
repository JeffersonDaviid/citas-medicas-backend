var mongoose = require('mongoose')
var port = '3600'
mongoose.Promise = global.Promise
var app = require('./app')

mongoose.set('strictQuery', false)
mongoose
	.connect(
		'mongodb://admin:password@localhost:27019', // docker-compose
		{}
	)
	.then(() => {
		console.log('Conectado a la base de datos')
		app.listen(port, () => {
			console.log('Servidor corriendo en http://localhost:' + port)
		})
	})
	.catch((err) => console.log(err))
