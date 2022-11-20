import React from "react"
import { ToastContainer, toast } from "react-toastify"
import { CircularProgress } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import TextField from "@material-ui/core/TextField"
import { useFormik } from "formik"
import * as yup from "yup"
import { useLocation, Redirect } from "react-router-dom"
import Button from "@material-ui/core/Button"
import { useConfirmTransactionMutation } from "./TransactionApiSlice"

const useStyles = makeStyles({
  button: {
    backgroundColor: "#2332AC",
    margin: "25px 0 0 0 ",
    color: "white",
    fontSize: "15px",
    width: "90px",
    "&:hover": {
      color: "#6495ed",
      border: "1px solid",
    },
  },
  buttonLoading: {
    backgroundColor: "white",
    margin: "25px 0 0 0",
    color: "white",
    fontSize: "15px",
    width: "90px",
    "&:hover": {
      color: "#6495ed",
      border: "1px solid",
    },
  },
  ConfirmFormTransactions: {
    marginTop: "150px",
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  codeTextField: {
    padding: "0",
    margin: "30px 0 10px 0",
    width: "100%",
  },
  titleConfirmTransactions: {
    width: "400px",
    color: "#4D5863",
    fontSize: "20px",
    fontFamily: `"Libre Baskerville", serif`,
    marginTop: "30px",
  },
})

const TransactionValidation = yup.object().shape({
  code: yup
    .string()
    .required("This field is required")
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(6, "Must be exactly 6 digits")
    .max(6, "Must be exactly 6 digits"),
})

function ConfirmTransactionForm() {
  const { state } = useLocation()
  const initialValues = {
    transactionId: 0,
    code: 0,
  }
  const classes = useStyles()
  const [confirmTransactions, { isLoading }] = useConfirmTransactionMutation()
  const [success, setSuccess] = React.useState(false)
  const formik = useFormik({
    initialValues,
    validationSchema: TransactionValidation,
    onSubmit: async (values) => {
      values.transactionId = state.id
      try {
        await confirmTransactions(values).unwrap()
        setSuccess(true)
      } catch (error) {
        toast.error(error.data.error, {
          position: "bottom-right",
        })
      }
    },
  })
  if (success) {
    return (
      <Redirect
        to={{
          pathname: "/success",
        }}
      />
    )
  }
  return (
    <form
      onSubmit={formik.handleSubmit}
      className={classes.ConfirmFormTransactions}
    >
      <h1 className={classes.titleConfirmTransactions}>
        Enter verification code from google authenticator
      </h1>
      <div className="mainUpdateContainer">
        <TextField
          id="code"
          name="code"
          label={
            <div className="TextFieldLabel">
              <span>Verification code</span>
            </div>
          }
          value={formik.values.code}
          onChange={formik.handleChange}
          margin="normal"
          error={formik.touched.code && Boolean(formik.errors.code)}
          helperText={formik.touched.code && formik.errors.code}
          className={classes.codeTextField}
        />
        <br />
      </div>
      <>
        {isLoading ? (
          <Button
            type="submit"
            disabled={isLoading}
            className={classes.buttonLoading}
            variant="outlined"
          >
            <CircularProgress size={25} />
          </Button>
        ) : (
          <Button type="submit" className={classes.button} variant="outlined">
            Send
          </Button>
        )}
      </>
      <ToastContainer />
    </form>
  )
}

export default ConfirmTransactionForm
