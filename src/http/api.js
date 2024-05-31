import request from './request'

// 用户注册
export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data,
  })
}
// 用户登录
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data,
  })
}
// 获取用户信息
export function downloadXML(data) {
  return request({
    url: '/JsonToXml/xml',
    method: 'post',
    data,
  })
}
export function saveCanvas(data) {
  return request({
    url: '/canvas/save',
    method: 'post',
    data,
  })
}
export function getCanvas() {
  return request({
    url: '/canvas/get',
    method: 'get',
  })
}
export function updateCanvasName(data) {
  return request({
    url: '/canvas/update',
    method: 'post',
    data,
  })
}
export function deleteCanvas(data) {
  return request({
    url: '/canvas/delete',
    method: 'delete',
    data,
  })
}
