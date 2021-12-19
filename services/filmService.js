const {
  Op
} = require("sequelize");
const Film = require('../models/film_info')
const Schedule = require('../models/schedule_info');


/**
 * 通过id查询单个影片信息
 * @param {*} id 
 */
exports.findById = async function (id) {
  const result = await Film.findByPk(id)
  return result.toJSON()
}

//更新影片数据
exports.updateFilm = async function (filmObj) {
  const result = await Film.update(filmObj, {
    where: {
      id: filmObj.id
    }
  })
  return result
}

/**
 * 根据电影类目查询电影信息
 * @param {*} category 类目
 * @param {*} page 
 * @param {*} size 
 */
exports.findByCategory = async function (queryObj) {
  let page = queryObj.page || '1';
  let size = 10
  let category = queryObj.category
  const result = await Film.findAndCountAll({
    where: {
      category
    },
    attributes: ['id', 'name', 'filmImg', 'score'],
    limit: size,
    offset: (page - 1) * size
  })
  return {
    count: result.count,
    data: JSON.parse(JSON.stringify(result.rows))
  }
}

//通过影票名或者角色名进行查找
exports.findByName = async function (keyWords, page = 1, size = 10) {
  const result = await Film.findAndCountAll({
    where: {
      [Op.or]: [{
          name: {
            [Op.like]: `%${keyWords}%`
          }
        },
        {
          role: {
            [Op.like]: `%${keyWords}%`
          }
        }
      ]
    },
    limit: size,
    offset: size * (page - 1),
    attributes: ['id', 'filmImg', 'name', 'duration', 'releaseTime']
  })
  return {
    count: result.count,
    data: JSON.parse(JSON.stringify(result.rows))
  }
}

//通过电影类型或者区域进行查找
exports.findByOther = async function (filterWords, page = 1, size = 10) {
  let {
    type,
    region
  } = filterWords
  let where = null
  if (type == '全部' && region == '全部') {
    where = {}
  } else {
    type = type == '全部' ? '' : type
    region = region == '全部' ? '' : region
    if (type === '') {
      where = {
        region: {
          [Op.like]: `%${region}%`
        }
      }
    } else if (region === '') {
      where = {
        type: {
          [Op.eq]: type
        }
      }
    } else {
      where = {
        [Op.and]: [{
            type: {
              [Op.eq]: type
            }
          },
          {
            region: {
              [Op.like]: `%${region}%`
            }
          }
        ]
      }
    }
  }
  const result = await Film.findAndCountAll({
    where,
    limit: size,
    offset: size * (page - 1),
    attributes: ['id', 'filmImg', 'name', 'score', 'releaseTime']

  })
  return {
    count: result.count,
    data: JSON.parse(JSON.stringify(result.rows))
  }
}

//分页查找电影
exports.findByPage = async function (page = 1, size = 10) {
  const result = await Film.findAndCountAll({
    limit: size,
    offset: (page - 1) * size
  })
  return {
    count: result.count,
    data: JSON.parse(JSON.stringify(result.rows))
  }
}

//添加新的影片
exports.addFilm = async function (filmObj) {
  let {
    name
  } = filmObj
  let existData = await Film.findOne({
    where: {
      name
    }
  })
  if (existData !== null) {
    throw new Error('该影片已存在，请勿重复排片！')
  } else {
    const result = await Film.create(filmObj)
    return JSON.parse(JSON.stringify(result))
  }

}

//删除影片
exports.deleteFilm = async function (id) {
  let sres = await Schedule.findOne({
    where: {
      filmId: id
    }
  })
  if (sres !== null && JSON.parse(JSON.stringify(sres)).id != undefined) {
    throw new Error('该影片存在排片信息，不可删除！')
  } else {
    const result = await Film.destroy({
      where: {
        id
      }
    })
    return result
  }
}

//查找全部影片(正在上映)并返回id和影片名
exports.findAllFilms = async function () {
  let result = await Film.findAll({
    where: {
      category: 'hinting'
    },
    attributes: ['id', 'name']
  })
  return JSON.parse(JSON.stringify(result))
}
