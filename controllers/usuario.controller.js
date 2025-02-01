const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');

const controller = {
  register: async function (req, res) {
    try {
      const {
        nombre,
        email,
        password,
        cedula,
        fechaNacimiento,
        telefono,
        securityQuestion,
        securityAnswer,
      } = req.body;

      // Crear nuevo usuario
      const usuario = new Usuario({
        nombre,
        email,
        password, // Se guarda directamente en texto plano
        cedula,
        fechaNacimiento,
        telefono,
        securityQuestion,
        securityAnswer, // Se guarda directamente en texto plano
      });

      const usuarioGuardado = await usuario.save();
      return res.status(201).send({ message: 'Usuario registrado con éxito', usuario: usuarioGuardado });
    } catch (error) {
      return res.status(500).send({ message: 'Error al registrar el usuario', error });
    }
  },

  login: async function (req, res) {
    try {
      const { email, password } = req.body;
  
      // Buscar usuario por correo electrónico
      const usuario = await Usuario.findOne({ email });
      if (!usuario) {
        return res.status(404).send({ message: 'Usuario no encontrado' });
      }
  
      // Comparar la contraseña ingresada con la almacenada directamente en texto plano
      console.log('Contraseña ingresada:', password);
      console.log('Contraseña almacenada:', usuario.password);
  
      if (password !== usuario.password) {
        return res.status(401).send({ message: 'Correo o contraseña incorrectos' });
      }
  
      // Crear token de autenticación
      const token = jwt.sign({ id: usuario._id }, 'secreto', { expiresIn: '1h' });
  
      // Incluir el usuario en la respuesta
      return res.status(200).send({ message: 'Inicio de sesión exitoso', user: usuario, token });
    } catch (error) {
      return res.status(500).send({ message: 'Error al iniciar sesión', error });
    }
  },

  recoverPassword: async function (req, res) {
    try {
      const { email, securityAnswer, newPassword } = req.body;

      // Validar que todos los campos requeridos estén presentes
      if (!email || !securityAnswer || !newPassword) {
        return res.status(400).send({ message: 'Todos los campos son obligatorios' });
      }

      // Buscar usuario por correo electrónico
      const usuario = await Usuario.findOne({ email });
      if (!usuario) {
        return res.status(404).send({ message: 'Usuario no encontrado' });
      }

      // Comparar respuesta de seguridad directamente en texto plano
      console.log('Respuesta ingresada:', securityAnswer);
      console.log('Respuesta almacenada:', usuario.securityAnswer);

      if (securityAnswer !== usuario.securityAnswer) {
        return res.status(400).send({ message: 'Respuesta de seguridad incorrecta' });
      }

      // Validar que la nueva contraseña cumpla los requisitos
      const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        return res.status(400).send({
          message: 'La nueva contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial',
        });
      }

      // Actualizar contraseña directamente en texto plano
      usuario.password = newPassword;
      await usuario.save();

      return res.status(200).send({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
      return res.status(500).send({ message: 'Error al recuperar la contraseña', error });
    }
  },
};

module.exports = controller;
