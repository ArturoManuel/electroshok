import Categoria from './Categoria.js';
import Usuario from './Usuario.js';
import Producto from './Producto.js';
import CarritoItem from './CarritoItem.js';
import Pedido from './Pedido.js';
import DetallePedido from './DetallePedido.js';

Usuario.hasMany(CarritoItem, { foreignKey: 'id_usuario' });
Usuario.hasMany(Pedido, { foreignKey: 'id_usuario' });

Producto.hasMany(CarritoItem, { foreignKey: 'id_producto' });
Categoria.hasMany(Producto, { foreignKey: 'id_categoria' });

Pedido.hasMany(DetallePedido, { foreignKey: 'id_pedido' });
Producto.hasMany(DetallePedido, { foreignKey: 'id_producto' });

export {
  Categoria,
  Usuario,
  Producto,
  CarritoItem,
  Pedido,
  DetallePedido
};
