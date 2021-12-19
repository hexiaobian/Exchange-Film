/**
 * 影票信息
 */

const {
  DataTypes
} = require('sequelize');
const sequelize = require('./db.js');
const Film = require('./film_info')
const Cinema = require('./cinema_info')
const User = require('./user_info')


const Tickets = sequelize.define("Tickets", {
  filmId: {
    type: DataTypes.INTEGER,
    references: {
      model: Film,
      key: 'id'
    },
    allowNull: false
  },
  cinemaId: {
    type: DataTypes.INTEGER,
    references: {
      model: Cinema,
      key: 'id'
    },
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    },
    allowNull: false
  },
  showtime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  seat: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  isGet: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
})
module.exports = Tickets
