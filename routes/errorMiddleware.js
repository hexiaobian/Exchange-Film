//处理错误的中间件
module.exports = (err, req, res, next) => {
  if (err) {
    const errObj = {
      code: -1,
      msg: err instanceof Error ? err.message : err
    }
    res.status(500).send(errObj)
    return errObj
  } else {
    next()
  }
}
