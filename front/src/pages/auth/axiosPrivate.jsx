import axios from "axios"

const API_URL = "http://localhost:8080/"
const axiosPrivate = axios.create()
axiosPrivate.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token")
    if (token) {
      config.headers.access_token = token
    }

    return config
  },
  (error) => {
    Promise.reject(error)
  }
)
// Response interceptor for API calls
axiosPrivate.interceptors.response.use(
  (response) => response,
  (error) => {
    const token = localStorage.getItem("refresh_token")
    if (error.response.status === 403) {
      return axios
        .post(`${API_URL}refresh`, {}, { headers: { refresh_token: token } })
        .then((res) => {
          localStorage.setItem("access_token", res.headers.access_token)
          error.config.headers.access_token = res.headers.access_token
          localStorage.setItem("refresh_token", res.headers.refresh_token)

          return axios(error.config)
        })
        .catch((err) => err)
    }
    return Promise.reject(error)
  }
)
export default axiosPrivate
