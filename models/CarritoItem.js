import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Usuario from './Usuario.js';
import Producto from './Producto.js';

const CarritoItem = sequelize.define('CarritoItem', {
  id_item: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id_usuario'
    }
  },
  id_producto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Producto,
      key: 'id_producto'
    }
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'CarritoItem',
  timestamps: false
});

CarritoItem.belongsTo(Usuario, { foreignKey: 'id_usuario' });
CarritoItem.belongsTo(Producto, { foreignKey: 'id_producto' });

export default CarritoItem;
