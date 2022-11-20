import axios from "axios"

const API_URL = "http://localhost:8080/auth/"
function login(phoneNumber, password) {
  return axios
    .post(`${API_URL}sign-in`, { phoneNumber, password })
    .then((res) => {
      if (res.headers.access_token) {
        localStorage.setItem("access_token", res.headers.access_token)
        localStorage.setItem("refresh_token", res.headers.refresh_token)
      }
      return { data: res.data, status: res.status }
    })
    .catch((err) => err)
}
function getQR(phoneNumber) {
  return axios
    .post(`${API_URL}qr-code`, { phoneNumber }, { responseType: "arraybuffer" })
    .then((res) => {
      const base64 = btoa(
        new Uint8Array(res.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      )
      return `data:;base64,${base64}`
    })
    .catch((err) => err)
}
function confirmPhone(phoneNumber, code) {
  return axios
    .post(`${API_URL}confirm-phone`, { phoneNumber, code })
    .then((res) => ({ data: res.data, status: res.status }))
    .catch((err) => ({ err, status: 500 }))
}
function logout() {
  localStorage.removeItem("access_token")
}

function register(phoneNumber, email, password, secretQuestion) {
  return axios
    .post(`${API_URL}sign-up`, {
      phoneNumber,
      email,
      password,
      secretQuestion,
    })
    .then((res) => ({ data: res.data, status: res.status }))
    .catch((err) => ({
      err: err.response.data,
      status: err.response.status,
    }))
}
const AuthService = {
  login,
  logout,
  register,
  getQR,
  confirmPhone,
}
export default AuthService
