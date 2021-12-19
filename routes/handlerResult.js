exports.getErr = function (err = 'server internal error', errCode = 500) {
  return {
    code: errCode,
    msg: err instanceof Error ? err.msg : err
  }
}

exports.getResult = function (result) {
  return {
    code: 0,
    msg: 'success',
    data: result
  }
}
