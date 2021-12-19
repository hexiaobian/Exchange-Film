const {
  DataTypes
} = require('sequelize');
const sequelize = require('./db.js');
const User = require('./user_info')

const Order = sequelize.define('Order', {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    },
    allowNull: false
  },
  ticketsIds: {
    type: DataTypes.STRING,
    allowNull: false
  },
  filmName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cinemaName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dealTime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  dealprice: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  orderStatus: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '已付款'
  }
})

module.exports = Order
