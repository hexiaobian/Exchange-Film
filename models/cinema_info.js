/**
 * 影院信息
 */

const {
  DataTypes
} = require('sequelize');
const sequelize = require('./db.js');

const Cinema = sequelize.define('Cinema', {
  // 在这里定义模型属性
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  netTime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  }
}, {
  tableName: 'cinema_info',
  paranoid: true
});
module.exports = Cinema
