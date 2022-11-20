import React from "react"
import { useFormik } from "formik"
import * as yup from "yup"
import {
  Grid,
  Typography,
  TextField,
  withStyles,
  Slider,
  InputAdornment,
  makeStyles,
} from "@material-ui/core"
import AccessTimeIcon from "@material-ui/icons/AccessTime"
import CalcTable from "./CalcTable"
import DepositChart from "./DepositChart"

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  input: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  typography: {
    color: "rgb(0 0 0 / 70%)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    margin: "0 auto",
    width: "50%",
  },
}))

const CalcSlider = withStyles({
  root: { color: "#4A69FF", height: 10, width: "200%" },
  thumb: {
    height: 20,
    width: 20,
    backgroundColor: "white",
    border: "2px solid black",
    marginTop: -6,
    marginLeft: -5,
  },
  mark: { marginLeft: -5, marginTop: 2 },
  track: { height: 7, borderRadius: 2 },
  rail: { height: 7, borderRadius: 2 },
})(Slider)

export const MemoizedCalc = React.memo(CalcSlider)

const validationSchema = yup.object().shape({
  depAmount: yup
    .number("should be number")
    .required("Amount is required")
    .min(1000, "min value = 1000")
    .max(1000000, "max value = 1000000"),
  interestRate: yup
    .number("should be number")
    .required("Interest rate is required")
    .min(6, "min value = 6")
    .max(13, "max value = 12"),
  duration: yup
    .number("should be number")
    .required("Duration is required")
    .min(1, "min value = 1")
    .max(12, "max value = 12"),
})

const DepositCalculator = () => {
  const classes = useStyles()

  const formik = useFormik({
    initialValues: {
      depAmount: 1000000,
      interestRate: 13,
      duration: 12,
    },
    validationSchema,
  })
  const { depAmount } = formik.values
  const { duration } = formik.values
  const { interestRate } = formik.values

  const intRatePerMonth = interestRate / 1200
  const profitPerMonth = Math.round(formik.values.depAmount * intRatePerMonth)
  const totalAmountOfProfit = duration * profitPerMonth
  const totalAmountOfDeposit = Math.round(
    formik.values.depAmount + totalAmountOfProfit
  )

  const validateHandleChange = (e, min, max) => {
    if (e.target.value < min) {
      formik.setFieldValue([e.target.name], min)
    } else if (e.target.value > max) {
      formik.setFieldValue([e.target.name], max)
    } else formik.handleChange(e)
  }

  return (
    <div className="mt">
      <form className={classes.form}>
        <div className={classes.root}>
          <Grid container alignItems="flex-start" spacing={1}>
            <Grid container direction="column" item xs={9} spacing={3}>
              <Grid item xs={12} sm={6}>
                <DepositChart
                  depositAmount={depAmount}
                  totalProfit={totalAmountOfProfit}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CalcTable
                  depAmount={depAmount}
                  interestRate={interestRate}
                  duration={duration}
                  profitPerMonth={profitPerMonth}
                  totalAmountOfDeposit={totalAmountOfDeposit}
                  totalAmountOfProfit={totalAmountOfProfit}
                />
              </Grid>
            </Grid>
            <Grid
              container
              direction="row"
              item
              xs={3}
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs={12} sm={10}>
                <Typography className={classes.typography} variant="h6">
                  Deposit Amount
                </Typography>
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  className={classes.input}
                  margin="dense"
                  name="depAmount"
                  value={depAmount}
                  onChange={(event) => validateHandleChange(event, 1, 1000000)}
                  error={
                    formik.touched.depAmount && Boolean(formik.errors.depAmount)
                  }
                  helperText={
                    formik.touched.depAmount && formik.errors.depAmount
                  }
                  inputProps={{
                    style: { textAlign: "center" },
                    step: 100,
                    min: 1000,
                    max: 1000000,
                    type: "number",
                    "aria-labelledby": "input-slider",
                  }}
                  // eslint-disable-next-line react/jsx-no-duplicate-props
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₴</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <CalcSlider
                  value={depAmount}
                  onChange={(event, value) =>
                    formik.setFieldValue("depAmount", value)
                  }
                  min={1000}
                  max={1000000}
                  step={100}
                />
              </Grid>
              <Grid item xs={12} sm={10}>
                <Typography className={classes.typography} variant="h6">
                  Interest Rate{" "}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  className={classes.input}
                  margin="dense"
                  name="interestRate"
                  value={interestRate}
                  onChange={(event) => validateHandleChange(event, 6, 13)}
                  error={
                    formik.touched.interestRate &&
                    Boolean(formik.errors.interestRate)
                  }
                  helperText={
                    formik.touched.interestRate && formik.errors.interestRate
                  }
                  inputProps={{
                    style: { textAlign: "center" },
                    step: 1,
                    min: 1,
                    max: 13,
                    type: "number",
                    "aria-labelledby": "input-slider",
                  }}
                  // eslint-disable-next-line react/jsx-no-duplicate-props
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <h3>%</h3>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={12}>
                <CalcSlider
                  value={interestRate}
                  step={1}
                  min={6}
                  max={13}
                  onChange={(event, value) =>
                    formik.setFieldValue("interestRate", value)
                  }
                  valueLabelDisplay="auto"
                  defaultValue={interestRate}
                />
              </Grid>
              <Grid item xs={12} sm={10}>
                <Typography className={classes.typography} variant="h6">
                  Duration (month)
                </Typography>
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  className={classes.input}
                  margin="dense"
                  name="duration"
                  value={duration}
                  onChange={(event) => validateHandleChange(event, 1, 12)}
                  error={
                    formik.touched.duration && Boolean(formik.errors.duration)
                  }
                  helperText={formik.touched.duration && formik.errors.duration}
                  inputProps={{
                    style: { textAlign: "center" },
                    step: 1,
                    min: 1,
                    max: 12,
                    type: "number",
                    "aria-labelledby": "input-slider",
                  }}
                  // eslint-disable-next-line react/jsx-no-duplicate-props
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccessTimeIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <CalcSlider
                  value={duration}
                  onChange={(event, value) =>
                    formik.setFieldValue("duration", value)
                  }
                  defaultValue={duration}
                  step={1}
                  min={1}
                  max={12}
                  valueLabelDisplay="auto"
                />
              </Grid>
            </Grid>
          </Grid>
        </div>
      </form>
    </div>
  )
}

export default React.memo(DepositCalculator)
