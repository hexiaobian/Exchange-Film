import Cookies from 'js-cookie'

/**
 * 设置用户信息
 * @param {*} info
 */
export function setUserCookie (info) {
  const arr = Object.entries(info)
  for (let i = 0; i < arr.length; i++) {
    Cookies.set(arr[i][0], arr[i][1])
  }
  return true
}

/**
 * 获取用户信息
 */
export function getUserCookie () {
  return {
    account: Cookies.get('account'),
    nickname: Cookies.get('nickname'),
    id: Cookies.get('id')
  }
}
/**
 * 删除用户信息
 */
export function removeUserCookie () {
  Cookies.remove('account')
  Cookies.remove('nickname')
  Cookies.remove('id')
  return true
}

/**
 * 设置管理员信息
 * @param {*} info
 */
export function setManagerCookie (info) {
  const arr = Object.entries(info)
  for (let i = 0; i < arr.length; i++) {
    Cookies.set(arr[i][0], arr[i][1])
  }
  return true
}

/**
 * 获取管理员信息
 */
export function getManagerCookie () {
  return {
    account: Cookies.get('account'),
    name: Cookies.get('name'),
    id: Cookies.get('id')
  }
}
/**
 * 删除管理员信息
 */
export function removeManagerCookie () {
  Cookies.remove('account')
  Cookies.remove('name')
  Cookies.remove('id')
  return true
}
