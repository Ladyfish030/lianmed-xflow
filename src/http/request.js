import axios from 'axios'

const service = axios.create({
  baseURL: 'http://122.112.148.44:9090',
  timeout: 5000,
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    console.log(config)
    // 添加请求头等前置处理
    if (localStorage.getItem('token')) {
      config.headers['Authorization'] =
        'Bearer' + ' ' + localStorage.getItem('token')
    }
    return config
  },
  (error) => {
    // 请求错误处理
    console.log('Request Error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    console.log('到这里了')
    // 响应后处理
    // if (response.status === 200 && response.data.code === 200) {
    return Promise.resolve(response.data)
    // } else {
    //   return Promise.reject(response.data)
    // }
  },
  (error) => {
    console.log('Response Error:', error)
    return Promise.reject(error)
  }
)

export default service
