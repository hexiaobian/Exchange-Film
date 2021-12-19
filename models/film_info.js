/**
 * 影片信息
 */

const {
  DataTypes
} = require('sequelize');
const sequelize = require('./db.js');

const Film = sequelize.define('Film', {
  // 在这里定义模型属性
  introduction: {
    type: DataTypes.TEXT
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  duration: {
    type: DataTypes.STRING
  },
  type: {
    type: DataTypes.STRING,
  },
  director: {
    type: DataTypes.STRING,
  },
  role: {
    type: DataTypes.TEXT,
  },
  filmImg: {
    type: DataTypes.TEXT,
    defaultValue: 'none.png',
    allowNull: false
  },
  releaseTime: {
    type: DataTypes.STRING
  },
  region: {
    type: DataTypes.STRING
  },
  score: {
    type: DataTypes.FLOAT
  },
  category: {
    type: DataTypes.STRING,
    defaultValue: 'recommand'
  }
}, {
  tableName: 'film_info',
  timestamps: true,
  createdAt: false,
  paranoid: true
});
module.exports = Film
