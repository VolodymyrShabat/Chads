import React from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useSelector, useDispatch } from "react-redux"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import { useLocation, useHistory } from "react-router-dom"
import { confirmPhone, signUp, selectUser } from "./userSlice"

const confirmSchema = Yup.object().shape({
  code: Yup.number().required("code required!"),
})
const initialValues = {
  phoneNumber: "",
  code: "",
}
const PhoneConfirm = () => {
  const location = useLocation()
  const history = useHistory()
  const dispatch = useDispatch()
  const { srcQR } = useSelector(selectUser)
  const formik = useFormik({
    initialValues,
    validationSchema: confirmSchema,
    onSubmit: (values) => {
      values.phoneNumber = location.state.phoneNumber
      dispatch(confirmPhone(values)).then((res) => {
        if (res.payload.status === 200) {
          dispatch(signUp(location.state))
          history.push("/login")
        }
      })
    },
  })
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <form onSubmit={formik.handleSubmit}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div>{srcQR && <img src={srcQR} alt="QR" />}</div>
          <div style={{ width: 300 }}>
            <TextField
              error={formik.touched.code && formik.errors.code}
              helperText={formik.touched.code && formik.errors.code}
              id="code"
              label="code"
              value={formik.values.code}
              onChange={formik.handleChange}
              variant="outlined"
              style={{ marginTop: 15 }}
              fullWidth
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginTop: 15 }}
              fullWidth
            >
              Confirm
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default PhoneConfirm
