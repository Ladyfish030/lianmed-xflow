import request from './request'

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