module.exports = function (req, res, next) {
  // 处理简单请求
  if ('origin' in req.headers) {
    res.header(`access-control-allow-origin`, req.headers.origin)
  }
  //处理预检请求
  if (req.method === 'OPTIONS') {
    res.header(`access-control-allow-origin`, req.headers.origin)
    res.header(`access-control-allow-methods`, req.headers[`access-control-request-method`])
    res.header(`access-control-allow-headers`, req.headers[`access-control-request-headers`])
  }
  //处理带身份凭证的请求
  res.header(`access-control-with-credentials`, true)
  next()
}
