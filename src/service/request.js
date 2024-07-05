import axios from 'axios'

const service = axios.create({
  baseURL: 'http://122.112.148.44:9090',
  timeout: 5000,
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 添加请求头等前置处理
    if (localStorage.getItem('token')) {
      config.headers['Authorization'] =
        'Bearer ' + localStorage.getItem('token')
    }
    if (config.url == '/XmlToJson/json') {
      config.headers['Content-Type'] = 'multipart/form-data;'
    }
    return config
  },
  (error) => {
    // 请求错误处理
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 响应状态码为 200 时返回响应数据
    if (response.status === 200) {
      return Promise.resolve(response.data)
    } else {
      // 处理其他响应状态码
      return Promise.reject(new Error('Unexpected response status'))
    }
  },
  (error) => {
    console.log(error)
    // 响应错误处理
    let errorMessage = 'Unknown error'

    if (error.response) {
      // 服务器返回的响应码非 2xx 范围
      switch (error.response.status) {
        case 400:
          errorMessage = 'Bad Request'
          break
        case 401:
          errorMessage = 'Unauthorized'
          break
        case 403:
          errorMessage = 'Forbidden'
          break
        case 404:
          errorMessage = 'Not Found'
          break
        case 500:
          errorMessage = 'Internal Server Error'
          break
        default:
          errorMessage = `Error: ${error.response.status}`
      }
    } else if (error.request) {
      // 请求已经发送但没有收到响应
      errorMessage = 'No response received from server'
    } else {
      // 其他错误
      errorMessage = error.message
    }

    return Promise.reject(new Error(errorMessage))
  }
)

export default service
