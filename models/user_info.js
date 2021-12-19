/**
 * 用户信息
 */

const {
  DataTypes
} = require('sequelize');
const sequelize = require('./db.js');

const User = sequelize.define('User', {
  // 在这里定义模型属性
  account: {
    type: DataTypes.STRING(11),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nickname: {
    type: DataTypes.STRING,

  }
}, {
  tableName: 'user_info',
  timestamps: true,
  createdAt: false,
  paranoid: true
});

module.exports = User
