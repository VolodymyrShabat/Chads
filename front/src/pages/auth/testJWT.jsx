import React from "react"
import axiosPrivate from "./axiosPrivate"

const testSubmit = (e) => {
  e.preventDefault()
  axiosPrivate
    .post("http://localhost:8080/jwt-test")
    .then((res) => {
      console.log(res.data)
    })
    .catch((err) => {
      console.log(err)
    })
}
const Test = () => (
  <div>
    <button
      type="button"
      onClick={(e) => {
        testSubmit(e)
      }}
    >
      Click me
    </button>
  </div>
)
export default Test
