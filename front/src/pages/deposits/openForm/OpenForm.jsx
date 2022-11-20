import React from "react"
import { useFormik } from "formik"
import * as yup from "yup"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.min.css"
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Button,
  TextField,
  CircularProgress,
  makeStyles,
  FormHelperText,
} from "@material-ui/core"
import styled from "styled-components"
import AutorenewIcon from "@material-ui/icons/Autorenew"
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab"
import { useAddDepositMutation } from "../depositsDataTable/depositsApiSlice"
import { useFetchUserBankAccountsQuery } from "../../BankAccount/BankAccountsApiSlice"
import { MemoizedCalc } from "../depositCalc/Calculator"
import bankCard from "./bgDepositType.jpg"

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    width: 450,
    textAlign: "center",
  },
  selectEmpty: {
    marginTop: theme.spacing(5),
  },
  root: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(3),
    minWidth: 850,
    minHeight: 200,
    color: "rgb(0 0 0 / 70%)",
    border: 0,
    right: "15%",
    marginRight: theme.spacing(2),
    "&:hover": {
      backgroundColor: "#9C9CFC",
      color: "#F3FAFF",
    },
    "&$selected": {
      backgroundImage: `url(${bankCard})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
      color: "white",
      boxShadow: "none",
      "&:hover": {
        backgroundColor: "#9C9CFC",
        color: "#F3FAFF",
      },
    },
  },
  selected: {},
  button: { minWidth: 200, minHeight: 50, marginTop: 50, left: "140px" },
  form: {
    display: "flex",
    flexDirection: "column",
    margin: "0 auto",
    width: "50%",
  },
  errorMessage: {
    color: "red",
  },
}))

const OpenFormSlider = styled(MemoizedCalc)`
  width: 400px:
`

const StyledToggleButton = styled(ToggleButton)`
  .MuiToggleButton-label {
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-direction: column;
    text-align: left;
  },
  
`

const StyledOpenForm = styled.div`
  padding-left: 60%;
`

const StyledValue = styled.div`
  display: inline-block;
  font-size: 16px;
  text-transform: lowercase;
  }
`

const marks = [
  {
    value: 2,
    label: "2",
  },

  {
    value: 4,
    label: "4",
  },

  {
    value: 6,
    label: "6",
  },

  {
    value: 8,
    label: "8",
  },

  {
    value: 10,
    label: "10",
  },

  {
    value: 12,
    label: "12",
  },
]

const OpenForm = () => {
  const classes = useStyles()
  const [addDeposit, { isLoading }] = useAddDepositMutation()
  const {
    data = [],
    isLoading: isBankAccLoading,
    refetch,
    isFetching,
  } = useFetchUserBankAccountsQuery()

  const validationSchema = yup.object().shape({
    depositAmount: yup
      .number("should be number")
      .required("Amount is required")
      .min(1, "min value = 1")
      .max(1000000, "Max deposit amount is 1 000 000"),
    duration: yup
      .number("should be number")
      .required("Duration is required")
      .min(1, "min value = 1")
      .max(12, "max value = 12"),
    id: yup
      .number("should be number")
      .required("id is required")
      .min(1, "Account number is required"),
  })

  const formik = useFormik({
    initialValues: {
      id: 0,
      type: "fast",
      duration: 6,
      depositAmount: 1,
      interestRate: 6,
      isActive: true,
      maxDuration: 6,
      minDuration: 1,
    },
    validationSchema,
    onSubmit: async (values) => {
      if (
        data.filter((el) => el.Id === values.id)[0].Amount <
        values.depositAmount
      ) {
        toast.error("Not enought money on this acc", {
          position: "bottom-right",
        })
        return
      }

      try {
        await addDeposit(values).unwrap()
        toast.success("🚀 Deposit created !", {
          position: "bottom-right",
        })
      } catch {
        toast.error("Error ! Try again later. ", {
          position: "bottom-right",
        })
      }
    },
  })

  const { depositAmount } = formik.values
  const { duration } = formik.values
  const { id } = formik.values
  const { maxDuration } = formik.values
  const { minDuration } = formik.values

  const valueType = [
    {
      type: "standart",
      interestRate: 10,
      active: false,
      maxDuration: 10,
      minDuration: 4,
      description:
        "The most popular deposit. This type is suitable for customers who want to make a good profit" +
        "and not wait long. The deposit has an average value for both duration and interest rate.",
    },
    {
      type: "fast",
      interestRate: 6,
      active: true,
      maxDuration: 6,
      minDuration: 1,
      description:
        "The fastest deposit. Suitable for customers who do not want to wait long for income. The deposit has the shortest duration," +
        "so the client can get the money very quickly. But the interest rate for this type of deposit is the lowest.",
    },
    {
      type: "econom",
      interestRate: 13,
      active: false,
      maxDuration: 12,
      minDuration: 6,
      description:
        "Deposit with the highest interest rate. Suitable for customers who want to get the most profit from their investments." +
        "This type of deposit has the highest interest rate and aims to give the client the highest income. But its minimum duration is not the shortest.",
    },
  ]

  const marksToRender = () => {
    let marksRender = marks
    if (maxDuration === 6) {
      marksRender = marks.slice(0, 3)
    } else if (maxDuration === 10) {
      marksRender = marks.slice(1, 5)
    } else if (maxDuration === 12) {
      marksRender = marks.slice(2)
    }
    return marksRender
  }

  const [typeValues, setTypeValues] = React.useState(valueType)

  const clickHandler = (type) => () => {
    setTypeValues((items) =>
      items.map((item) => ({
        ...item,
        active: item.type === type,
      }))
    )
  }
  return (
    <div>
      <form className={classes.form} onSubmit={formik.handleSubmit}>
        <Grid
          container
          justifyContent="center"
          alignItems="flex-start"
          className={classes.selectEmpty}
        >
          <Grid item xs={12} sm={9}>
            <ToggleButtonGroup
              orientation="vertical"
              value={formik.values}
              exclusive
              onChange={(event, value) =>
                formik.setFieldValue("type", value[Object.keys(value)[0]]) &&
                formik.setFieldValue(
                  "interestRate",
                  value[Object.keys(value)[1]]
                ) &&
                formik.setFieldValue(
                  "maxDuration",
                  value[Object.keys(value)[3]]
                ) &&
                formik.setFieldValue(
                  "minDuration",
                  value[Object.keys(value)[4]]
                ) &&
                formik.setFieldValue("duration", value[Object.keys(value)[4]])
              }
            >
              {typeValues.map((item, index) => (
                <StyledToggleButton
                  disabled={isLoading}
                  key={item.type}
                  classes={{
                    root: classes.root,
                    selected: classes.selected,
                  }}
                  selected={item.active}
                  value={valueType[index]}
                  onClick={clickHandler(item.type)}
                >
                  <h2>{item.type}</h2>
                  <div style={{ fontSize: "11px" }}>
                    {" "}
                    Max duration:&nbsp;&nbsp;
                    <StyledValue>
                      {item.maxDuration}&nbsp;&nbsp;months&nbsp;&nbsp;
                    </StyledValue>
                    Min duration: &nbsp;&nbsp;
                    <StyledValue>
                      {item.minDuration}&nbsp;&nbsp;months&nbsp;&nbsp;
                    </StyledValue>
                    Interest rate:&nbsp;&nbsp;
                    <StyledValue>{item.interestRate}%</StyledValue>
                  </div>
                  <h4>
                    Description:{" "}
                    <div style={{ fontSize: "12px" }}>{item.description}</div>
                  </h4>
                </StyledToggleButton>
              ))}
            </ToggleButtonGroup>
          </Grid>
          <Grid item xs={12} sm={3}>
            <StyledOpenForm>
              <Button disabled={isLoading || isFetching} onClick={refetch}>
                {" "}
                <AutorenewIcon color="primary" />
              </Button>
              <FormControl className={classes.formControl}>
                {formik.errors.id ? (
                  <FormHelperText className={classes.errorMessage}>
                    {formik.touched.id && formik.errors.id}
                  </FormHelperText>
                ) : (
                  <InputLabel id="select">Account number</InputLabel>
                )}

                {isBankAccLoading || isFetching ? (
                  <Select
                    disabled={
                      isBankAccLoading || isBankAccLoading || isFetching
                    }
                    labelId="Bank account"
                    name="id"
                    id="id"
                    value={1}
                    label="acc number"
                  >
                    <MenuItem value={1}>
                      <Typography color="primary">
                        Loading...&nbsp;&nbsp;
                        <CircularProgress size={20} color="primary" />
                      </Typography>
                    </MenuItem>
                  </Select>
                ) : (
                  <Select
                    disabled={isLoading || isBankAccLoading || isFetching}
                    labelId="Bank account"
                    name="id"
                    id="id"
                    value={id}
                    onChange={formik.handleChange}
                    label="acc number"
                    error={formik.touched.id && Boolean(formik.errors.id)}
                  >
                    <MenuItem id={0} value={0}>
                      {" "}
                      Select account !
                    </MenuItem>
                    {data.map((element) => (
                      <MenuItem id={element.Id} value={element.Id}>
                        number: &nbsp;&nbsp; {element.Id}
                        &nbsp;&nbsp;&nbsp;&nbsp; amount:&nbsp;&nbsp;&nbsp;&nbsp;
                        {element.Amount}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              </FormControl>
              <TextField
                disabled={isLoading || isBankAccLoading}
                className={classes.formControl}
                id="depositAmount"
                type="number"
                name="depositAmount"
                label="Deposit amount"
                value={depositAmount}
                onChange={formik.handleChange}
                inputProps={{ style: { textAlign: "center" } }}
                error={
                  formik.touched.depositAmount &&
                  Boolean(formik.errors.depositAmount)
                }
                helperText={
                  formik.touched.depositAmount && formik.errors.depositAmount
                }
              />{" "}
              <Typography
                className={classes.formControl}
                gutterBottom
                variant="subtitle2"
                align="left"
              >
                Duration (month)
              </Typography>
              <OpenFormSlider
                disabled={isLoading || isBankAccLoading}
                className={classes.formControl}
                value={duration}
                onChange={(event, value) =>
                  formik.setFieldValue("duration", value)
                }
                step={1}
                min={minDuration}
                marks={marksToRender()}
                max={maxDuration}
                valueLabelDisplay="auto"
              />
              {isLoading ? (
                <Button
                  className={classes.button}
                  color="primary"
                  variant="contained"
                  type="submit"
                  disabled={isLoading || isBankAccLoading || isFetching}
                >
                  <Typography color="primary">
                    Loading...&nbsp;&nbsp;
                  </Typography>
                  <CircularProgress color="primary" />
                </Button>
              ) : (
                <Button
                  className={classes.button}
                  color="primary"
                  variant="contained"
                  type="submit"
                  disabled={isLoading || isBankAccLoading || isFetching}
                >
                  Create
                </Button>
              )}
            </StyledOpenForm>
          </Grid>
        </Grid>
      </form>
      <ToastContainer />
    </div>
  )
}

export default OpenForm
