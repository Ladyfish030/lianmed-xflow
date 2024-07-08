import request from './request'

export function getGlobalConfigByName(name) {
  return request({
    url: `/GlobalJson/getGlobalConfigJsonByName?globalName=${name}`,
    method: 'get',
  })
}

export function getAllGlobalConfig() {
  return request({
    url: '/GlobalJson/getGlobalConfigJson',
    method: 'get'
  })
}

export function saveGlobalConfig(data) {
  return request({
    url: '/GlobalJson/saveGlobalConfigJson',
    method: 'post',
    data,
  })
}

export function updateGlobalConfig(data) {
  return request({
    url: '/GlobalJson/updateGlobalConfigJson',
    method: 'put',
    data,
  })
}

export function deleteGlobalConfig(id) {
  return request({
    url: `/GlobalJson/deleteGlobalConfigJson?id=${id}`,
    method: 'delete',
  })
}