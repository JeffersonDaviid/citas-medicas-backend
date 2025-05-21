# 🏥 Citas Médicas Backend

Este repositorio contiene la **API REST** del proyecto de reserva de citas médicas online. Está implementado con **Node.js**, **Express** y **MongoDB** (Docker) , y utiliza **JWT** para autenticación y **SendGrid** para el envío de correos de confirmación y cancelación de citas.



## 📂 Estructura del Proyecto

```

citas-medicas-backend/
├── controllers/         # Lógica de negocio (Auth, Usuarios, Médicos, Citas)
├── middleware/          # Middleware de autenticación, manejo de errores
├── models/              # Esquemas de datos (User, Doctor, Appointment)
├── routes/              # Definición de endpoints por recurso
├── nodemailer.js        # Configuración de transporte de correo
├── app.js               # Configuración general de Express
├── index.js             # Punto de entrada de la aplicación
├── package.json         # Dependencias y scripts
└── .gitignore

````

---

## 🔧 Tecnologías y Dependencias

- **Node.js & Express**  
- **Base de datos**: MongoDB (vía Mongoose) / PostgreSQL (configurable)  
- **Autenticación**: JSON Web Tokens (JWT)  
- **Envío de correos**: SendGrid (SMTP) / Nodemailer  
- **Otras**:  
  - `dotenv` para variables de entorno  
  - `bcrypt` para hashing de contraseñas  
  - `cors`, `helmet` y `morgan` para seguridad y logging  

---

## 🚀 Instalación y Ejecución

1. **Clona el repositorio**  
   ```bash
   git clone https://github.com/JeffersonDaviid/citas-medicas-backend.git
   cd citas-medicas-backend
   ```

2. **Instala dependencias**
   ```bash
   npm install
   ```


3. **Ejecuta la base de datos**

    * Inciar la base de datos
     ```bash
     npm run db
     ```

   Cadena de conexión `mongodb://admin:password@localhost:27019`.

4. **Ejecuta la aplicación**

   * En desarrollo (con nodemon):

     ```bash
     npm run dev
     ```
   * En producción:

     ```bash
     npm start
     ```

   El servidor quedará escuchando en `http://localhost:<PORT>`.

---

## 📋 Endpoints Principales

> **Nota:** Todos los endpoints que modifican datos requieren el header `Authorization: Bearer <token>`
> – Para obtener el token, primero regístrate o loguéate vía `/api/auth/register` y `/api/auth/login`.

| Método | Ruta                         | Descripción                                 |
| ------ | ---------------------------- | ------------------------------------------- |
| POST   | `/api/auth/register`         | Registro de paciente                        |
| POST   | `/api/auth/login`            | Login de paciente → devuelve JWT            |
| GET    | `/api/doctors?specialty=XXX` | Listar médicos por especialidad             |
| GET    | `/api/doctors/:id/slots`     | Obtener franjas horarias disponibles        |
| POST   | `/api/appointments`          | Crear nueva cita                            |
| GET    | `/api/appointments`          | Listar citas del usuario autenticado        |
| DELETE | `/api/appointments/:id`      | Cancelar cita (envía correo de cancelación) |

Para alta o actualización de médicos (solo admin/automático), se exponen los endpoints en `/api/doctors` sin interfaz UI.

---

## 📧 Envío de Correos

* Al programar una cita, se envía un **correo de confirmación** con los datos y un enlace para cancelar.
* Al cancelar desde el enlace, se envía un **correo de notificación de cancelación**.
* Configuración principal en [`nodemailer.js`](nodemailer.js).

---

## 🤖 Middleware Clave

* **`authMiddleware`**: valida y decodifica el JWT del header `Authorization`.
* **`errorHandler`**: captura errores y envía JSON con `{ message, status }`.
* **`cors` & `helmet`**: protegen contra vulnerabilidades comunes.

---

 
