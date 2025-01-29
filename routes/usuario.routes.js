const express = require('express');
const UsuarioController = require('../controllers/usuario.controller'); // Verifica que este archivo exista y exporte las funciones correctas
const router = express.Router();

// Rutas
router.post('/register', UsuarioController.register);
router.post('/login', UsuarioController.login);
router.post('/recover-password', UsuarioController.recoverPassword); // Asegúrate de que esta función exista

module.exports = router;
