const {
  Sequelize
} = require('sequelize');

const sequelize = new Sequelize('filmplatformdb', 'root', '20190902', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

module.exports = sequelize
