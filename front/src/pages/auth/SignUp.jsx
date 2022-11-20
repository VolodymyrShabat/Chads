/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useDispatch } from "react-redux"
import TextField from "@material-ui/core/TextField"
import IconButton from "@material-ui/core/IconButton"
import InputAdornment from "@material-ui/core/InputAdornment"
import PhoneIcon from "@material-ui/icons/PhoneIphone"
import Visibility from "@material-ui/icons/Visibility"
import VisibilityOff from "@material-ui/icons/VisibilityOff"
import Button from "@material-ui/core/Button"
import CircularProgress from "@material-ui/core/CircularProgress"
import EmailIcon from "@material-ui/icons/Email"
import { useHistory } from "react-router-dom"
import { getQR } from "./userSlice"
import "./css/auth.css"

const signUpSchema = Yup.object().shape({
  phoneNumber: Yup.string()
    .trim()
    .required("phone is required")
    .matches(/^(\+38)?(0[5-9][0-9]\d{7})$/, "invalid phone number"),
  email: Yup.string()
    .trim()
    .required("email is required")
    .email("invalid email"),
  password: Yup.string()
    .trim()
    .required("password is required")
    .matches(
      /^(?=.*[a-zа-я])(?=.*[A-ZА-Я])(?=.*[0-9])(?=.{8,128})/,
      " password required at least one lowercase symbol, one uppercase and one number"
    ),
  confirm_password: Yup.string()
    .trim()
    .required("password is required")
    .oneOf([Yup.ref("password"), null], "passwords must match!"),
  secret_question: Yup.string().trim(),
})
const initialValues = {
  phoneNumber: "",
  email: "",
  password: "",
  confirm_password: "",
  secretQuestion: "",
}
const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false)
  const history = useHistory()
  const dispatch = useDispatch()
  const formik = useFormik({
    initialValues,
    validationSchema: signUpSchema,
    onSubmit: (values) => {
      dispatch(getQR(values))
      history.push("/testQR", values)
    },
  })

  return (
    <div className="form-container">
      <div style={{ textAlign: "left" }}>
        <h1>Registration</h1>
      </div>
      <form onSubmit={formik.handleSubmit}>
        {/* <span className="note">example: 0978431274 or +380978431274</span> */}
        <div className="signup-content">
          <div className="form-group">
            <div className="form-row">
              <TextField
                error={formik.touched.phoneNumber && formik.errors.phoneNumber}
                helperText={
                  formik.touched.phoneNumber && formik.errors.phoneNumber
                }
                id="phoneNumber"
                label="phone number"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                variant="outlined"
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
                error={formik.touched.email && formik.errors.email}
                helperText={formik.touched.email && formik.errors.email}
                type="email"
                id="email"
                label="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                variant="outlined"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </div>
          <div className="form-group">
            <div className="form-row">
              <TextField
                style={{ maxWidth: 310 }}
                error={formik.touched.password && formik.errors.password}
                helperText={formik.touched.password && formik.errors.password}
                type={showPassword ? "text" : "password"}
                id="password"
                label="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                variant="outlined"
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
            <div className="form-row">
              <TextField
                error={
                  formik.touched.confirm_password &&
                  formik.errors.confirm_password
                }
                helperText={
                  formik.touched.confirm_password &&
                  formik.errors.confirm_password
                }
                type={showPassword ? "text" : "password"}
                id="confirm_password"
                label="confirm password"
                value={formik.values.confirm_password}
                onChange={formik.handleChange}
                variant="outlined"
                fullWidth
              />
            </div>
          </div>
        </div>
        <div className="form-row">
          <TextField
            style={{ marginTop: 50 }}
            error={
              formik.touched.secretQuestion && formik.errors.secretQuestion
            }
            helperText={
              formik.touched.secretQuestion && formik.errors.secretQuestion
            }
            type="text"
            id="secretQuestion"
            label="secret question"
            value={formik.values.secretQuestion}
            onChange={formik.handleChange}
            variant="outlined"
            fullWidth
          />
        </div>

        <Button
          style={{ marginTop: 15 }}
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
        >
          Sign Up
          {formik.isSubmitting && (
            <CircularProgress size={25} style={{ marginLeft: 10 }} />
          )}
        </Button>
      </form>
    </div>
  )
}
export default SignUp
