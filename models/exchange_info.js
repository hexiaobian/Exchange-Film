const {
  DataTypes
} = require('sequelize');
const sequelize = require('./db.js');
const Tickets = require('./tickets_info');
const User = require('./user_info')

const Exchange = sequelize.define('Exchange', {
  ticketId: {
    type: DataTypes.INTEGER,
    references: {
      model: Tickets,
      key: 'id'
    },
    allowNull: false
  },
  userNickname: {
    type: DataTypes.STRING,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    },
    allowNull: false
  },
  targetId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    },
    allowNull: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  discount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  isDeal: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  dealtime: {
    type: DataTypes.DATE
  },
  uuid: {
    type: DataTypes.STRING
  },
  isEquival: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
})


module.exports = Exchange
