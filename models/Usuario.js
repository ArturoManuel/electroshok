import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Usuario = sequelize.define('Usuario', {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  correo_electronico: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  contrasena: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  rol: {
    type: DataTypes.ENUM('cliente', 'administrador'),
    defaultValue: 'cliente'
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  esta_activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  intentos_login: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  pregunta_secreta: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  respuesta_secreta: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  otp: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  otp_expira: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'Usuario',
  timestamps: false
});

export default Usuario;
