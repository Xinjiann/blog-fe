import axios from 'axios'
import Element from 'element-ui'
import router from './router'
import store from './store'

axios.defaults.baseURL = "http://34.105.136.131:8081"
// axios.defaults.baseURL = "http://localhost:8081"
// 前置拦截
axios.interceptors.request.use(config => {
  return config
})
axios.interceptors.response.use(response => {
    let res = response.data;
    if (res.code === 200) {
      return response
    } else {
      Element.Message.error(res.msg, {duration: 3 * 1000})
      return Promise.reject(response.data.msg)
    }
  },
  error => {
    console.log(error)
    if(error.response.data) {
      error.message = error.response.data.msg
    }
    if(error.response.status === 401) {
      store.commit("REMOVE_INFO")
      router.push("/login")
    }
    Element.Message.error(error.message, {duration: 3 * 1000})
    return Promise.reject(error)
  }
)