import request from './request'

export function downloadXML(data) {
  return request({
    url: '/JsonToXml/xml',
    method: 'post',
    data,
  })
}

export function uploadXML(file) {
  return request({
    url: '/XmlToJson/json',
    method: 'post',
    file,
  })
}

export function saveCanvas(data) {
  return request({
    url: '/canvas/save',
    method: 'post',
    data,
  })
}

export function getAllCanvas() {
  return request({
    url: '/canvas/get',
    method: 'get',
  })
}

export function getCanvasById(id) {
  return request({
    url: `/canvas/get?id=${id}`,
    method: 'get',
  })
}

export function updateCanvas(data) {
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
