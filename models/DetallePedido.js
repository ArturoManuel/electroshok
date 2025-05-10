import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Pedido from './Pedido.js';
import Producto from './Producto.js';

const DetallePedido = sequelize.define('DetallePedido', {
  id_detalle: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_pedido: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Pedido,
      key: 'id_pedido'
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
  },
  precio_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'DetallePedido',
  timestamps: false
});

DetallePedido.belongsTo(Pedido, { foreignKey: 'id_pedido' });
DetallePedido.belongsTo(Producto, { foreignKey: 'id_producto' });

export default DetallePedido;
