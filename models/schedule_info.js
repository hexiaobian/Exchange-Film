const {
  DataTypes
} = require('sequelize');
const sequelize = require('./db.js');
const Film = require('./film_info')
const Cinema = require('./cinema_info')

const Schedule = sequelize.define('Schedule', {
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
  schedule: {
    type: DataTypes.DATE,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
})


module.exports = Schedule
