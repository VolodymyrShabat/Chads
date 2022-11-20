import React from "react"
import { ToastContainer, toast } from "react-toastify"
import { CircularProgress } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import TextField from "@material-ui/core/TextField"
import { useFormik } from "formik"
import * as yup from "yup"
import "./css/UpdateForm.css"
import Button from "@material-ui/core/Button"
import { useUpdateTransactionLimitMutation } from "./BankAccountsApiSlice"

const initialValues = {
  transaction_limit: 0,
  id: 0,
}

const useStyles = makeStyles({
  button: {
    backgroundColor: "#2332AC",
    margin: "25px 0 0 20px ",
    color: "white",
    fontSize: "10px",
    width: "90px",
    "&:hover": {
      color: "#6495ed",
      border: "1px solid",
    },
  },
  buttonLoading: {
    backgroundColor: "white",
    margin: "25px 0 0 20px ",
    color: "white",
    fontSize: "10px",
    width: "90px",
    "&:hover": {
      color: "#6495ed",
      border: "1px solid",
    },
    transactionLimitText: {
      padding: "0",
      margin: "0 0 10px 0",
      width: "100%",
    },
  },
})

const TransactionValidation = yup.object().shape({
  transaction_limit: yup
    .number("should be a number")
    .min(1, "min value = 1")
    .required("this field is required"),
})

function UpdateLimitForm({ id, transactionLimit, isFetching }) {
  const classes = useStyles()
  const [updateLimit, { isLoading }] = useUpdateTransactionLimitMutation()
  const formik = useFormik({
    initialValues,
    validationSchema: TransactionValidation,
    onSubmit: async (values) => {
      values.id = id
      try {
        await updateLimit(values).unwrap()
        toast.success("🚀 Transaction limit updated !", {
          position: "bottom-right",
        })
      } catch {
        toast.error("Error ! Try again later. ", {
          position: "bottom-right",
        })
      }
    },
  })
  return (
    <form onSubmit={formik.handleSubmit} className="UpdateForm">
      <div className="mainUpdateContainer">
        <h3 className="UpdateTitle">Current : {transactionLimit}</h3>
        <TextField
          className={classes.transactionLimitText}
          id="transaction_limit"
          name="transaction_limit"
          label={
            <div className="TextFieldLabel">
              <span>New transaction limit</span>
            </div>
          }
          value={formik.values.transaction_limit}
          onChange={formik.handleChange}
          margin="normal"
          error={
            formik.touched.transaction_limit &&
            Boolean(formik.errors.transaction_limit)
          }
          helperText={
            formik.touched.transaction_limit && formik.errors.transaction_limit
          }
          type="number"
        />
        <br />
      </div>
      <>
        {isLoading || isFetching ? (
          <Button
            type="submit"
            disabled={isLoading || isFetching}
            className={classes.buttonLoading}
            variant="outlined"
          >
            <CircularProgress size={20} />
          </Button>
        ) : (
          <Button type="submit" className={classes.button} variant="outlined">
            Change
          </Button>
        )}
      </>
      <ToastContainer />
    </form>
  )
}

export default UpdateLimitForm
