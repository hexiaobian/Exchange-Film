import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:4000/api'
})

instance.interceptors.response.use(res => {
  return res.data
})
export default instance
