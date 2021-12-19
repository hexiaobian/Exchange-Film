/**
 * 管理员信息
 */

const {
  DataTypes
} = require('sequelize');
const sequelize = require('./db.js');

const Manager = sequelize.define('Manager', {
  // 在这里定义模型属性
  account: {
    type: DataTypes.STRING(11),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'manager_info',
  timestamps: true,
  createdAt: false,
  paranoid: true

});

module.exports = Manager
