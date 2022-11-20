/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useFormik } from "formik"
import * as Yup from "yup"
import TextField from "@material-ui/core/TextField"
import IconButton from "@material-ui/core/IconButton"
import InputAdornment from "@material-ui/core/InputAdornment"
import PhoneIcon from "@material-ui/icons/PhoneIphone"
import Visibility from "@material-ui/icons/Visibility"
import VisibilityOff from "@material-ui/icons/VisibilityOff"
import Button from "@material-ui/core/Button"
import CircularProgress from "@material-ui/core/CircularProgress"
import { useHistory } from "react-router-dom"
import { login, selectUser, clearState } from "./userSlice"
import "./css/auth.css"

const signInSchema = Yup.object().shape({
  phone_number: Yup.string()
    .trim()
    .required("phone is required")
    .matches(/^(\+38)?(0[5-9][0-9]\d{7})$/, "invalid phone number"),

  password: Yup.string().trim().required("Password is required"),
  // .matches(
  //  /^(?=.*[a-zа-я])(?=.*[A-ZА-Я])(?=.*[0-9])(?=.{8,128})/,
  // " password required at least one lowercase symbol, one uppercase and one number"
  // ),
})
const initialValues = {
  phone_number: "",
  password: "",
}
const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const history = useHistory()
  const dispatch = useDispatch()
  const { isSuccess, isError, isLoading, errorMessage } =
    useSelector(selectUser)
  const formik = useFormik({
    initialValues,
    validationSchema: signInSchema,
    onSubmit: (values) => {
      if (errorMessage) {
        dispatch(clearState())
      }
      dispatch(login(values))
    },
  })
  useEffect(() => {
    if (isSuccess) {
      dispatch(clearState())
      history.push("/cards")
    }
    if (errorMessage) {
      formik.setSubmitting(false)
    }
  }, [isSuccess, isError])
  return (
    <div className="form-container">
      <div style={{ textAlign: "left" }}>
        <h2>Login to Account</h2>
        <h4>Enter you login data</h4>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className="form-content">
          <div className="form-row">
            <TextField
              error={
                (formik.touched.phone_number && formik.errors.phone_number) ||
                errorMessage
              }
              helperText={
                formik.touched.phone_number && formik.errors.phone_number
              }
              type="text"
              id="phone_number"
              label="phone number"
              value={formik.values.phone_number}
              onChange={formik.handleChange}
              variant="outlined"
              style={{ marginTop: 15 }}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <PhoneIcon />
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div className="form-row">
            <TextField
              error={
                (formik.touched.password && formik.errors.password) ||
                errorMessage
              }
              helperText={formik.touched.password && formik.errors.password}
              type={showPassword ? "text" : "password"}
              id="password"
              label="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              variant="outlined"
              style={{ marginTop: 15 }}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => {
                        setShowPassword(!showPassword)
                      }}
                      onMouseDown={(event) => {
                        event.preventDefault()
                      }}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: 15 }}
            fullWidth
            disabled={formik.isSubmitting}
          >
            Login Account
            {(isLoading || formik.isSubmitting) && (
              <CircularProgress size={25} style={{ marginLeft: 10 }} />
            )}
          </Button>
          {errorMessage && (
            <span className="error-message ">{errorMessage}</span>
          )}
        </div>
      </form>
    </div>
  )
}
export default Login
