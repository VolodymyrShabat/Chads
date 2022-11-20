/* eslint-disable react/jsx-props-no-spreading */
import React from "react"

import Cards from "react-credit-cards"
import "./css/Transaction.css"
import "react-credit-cards/es/styles-compiled.css"
import TextField from "@material-ui/core/TextField"
import { useFormik } from "formik"
import Radio from "@material-ui/core/Radio"
import RadioGroup from "@material-ui/core/RadioGroup"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import FormControl from "@material-ui/core/FormControl"
import FormLabel from "@material-ui/core/FormLabel"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/swiper.min.css"
import { ToastContainer, toast } from "react-toastify"
import "swiper/components/effect-cube/effect-cube.min.css"
import "swiper/components/pagination/pagination.min.css"
import SwiperCore, { EffectCoverflow, Pagination } from "swiper/core"
import Button from "@material-ui/core/Button"
import { makeStyles } from "@material-ui/core/styles"
import Box from "@material-ui/core/Box"
import * as yup from "yup"
import { Redirect } from "react-router-dom"
import { CircularProgress } from "@material-ui/core"
import {
  useFetchUserCardsQuery,
  useSendTransactionMutation,
} from "./TransactionApiSlice"

const useStyles = makeStyles((theme) => ({
  input: {
    justifyContent: "center",
    width: "290px",
  },
  emptyText: {
    padding: "10px",
    margin: "0 auto",
    textAlign: "center",
    color: "#4d5863",
    fontSize: "30px",
    fontFamily: `"Libre Baskerville", serif`,
  },
  radioButtonLabelTitle: {
    textAlign: "left",
  },
  radioButton: {
    margin: "50px",
  },
  comment: {
    width: "50%",
    marginTop: "50px",
    marginLeft: "50px",
  },
  commentSpan: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    spaceBetween: "1%",
  },
  submitButton: {
    backgroundColor: "#3F51B5",
    padding: "9px 18px",
    fontSize: "15px",
    color: "white",
    margin: "20px 0 0 175px",
    width: "180px",
  },
  transactionSum: {
    width: "50%",
    marginLeft: "50px",
  },
  buttonLoading: {
    backgroundColor: "white",
    margin: "20px 0 0 175px",
    color: "white",
    fontSize: "15px",
    width: "180px",
  },
  swiperSlide: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  nestedDiv: {
    width: "50%",
  },
}))

SwiperCore.use([EffectCoverflow, Pagination])

function Transaction() {
  const { data = [{ cardNumber: 0 }], isLoading } = useFetchUserCardsQuery()

  const [selected, setSelected] = React.useState(0)
  const [value, setValue] = React.useState("Transfer funds")
  const [confirmId, setConfirmId] = React.useState(0)
  const [sendTransaction, { isLoading: isLoadingTransaction }] =
    useSendTransactionMutation()
  const handleChange = (event) => {
    setValue(event.target.value)
  }
  const initialValues = {
    senderNumber: data[0].cardNumber,
    receiverNumber: 0,
    remittance: 0,
    transactionComment: "",
  }

  const TransactionValidation = yup.object().shape({
    receiverNumber: yup
      .number("should be a number")
      .required("Card number is required")
      .test(
        "len",
        "cardnumber should contain 16 characters",
        (val) => val && val.toString().length === 16
      ),
    senderNumber: yup
      .number("should be number")
      .required("card is required")
      .test(
        "len",
        "cardnumber should contain 16 characters",
        (val) => val && val.toString().length === 16
      ),
    remittance: yup
      .number("should be number")
      .required("sum is required")
      .min(1, "min value = 1"),
  })

  const formik = useFormik({
    initialValues,
    validationSchema: TransactionValidation,
    enableReinitialize: true,
    validateOnMount: true,
    onSubmit: async (values) => {
      if (values.senderNumber === values.receiverNumber) {
        toast.error("Error ! Cannot transfer funds to the same card !. ", {
          position: "bottom-right",
        })
        return
      }
      try {
        await sendTransaction(values).unwrap()
        toast.success("🚀 Transaction success", {
          position: "bottom-right",
        })
      } catch (error) {
        if (error.status === 301) {
          setConfirmId(error.data.id)
        }
        toast.error(error.data.error, {
          position: "bottom-right",
        })
      }
    },
  })
  const classes = useStyles()

  if (isLoading) {
    return <CircularProgress size={200} style={{ margin: "10% auto" }} />
  }
  if (confirmId !== 0) {
    return (
      <Redirect
        to={{
          pathname: "/confirmTransaction",
          state: { id: confirmId },
        }}
      />
    )
  }
  return (
    <Box
      display="flex"
      m="auto"
      mt={5}
      align-items="center"
      justify-content="center"
    >
      {data[0].cardNumber !== 0 ? (
        <form onSubmit={formik.handleSubmit} className="FormTransaction">
          <div className="Transaction">
            <div className={classes.nestedDiv}>
              <div className="TransactionText">
                <h3>From Card</h3>
                <h4>
                  Please select the card from which you want to send money
                </h4>
              </div>
              <div>
                <center className="Sender">
                  <Swiper
                    effect="coverflow"
                    grabCursor
                    centeredSlides
                    slidesPerView={2}
                    coverflowEffect={{
                      rotate: 50,
                      stretch: 0,
                      depth: 100,
                      modifier: 1,
                      slideShadows: false,
                    }}
                    pagination={{
                      clickable: true,
                    }}
                    spaceBetween={-240}
                    onAfterInit={(swiper) => {
                      swiper.realIndex = 2
                    }}
                    onSlideChange={(swiper) => {
                      const { realIndex } = swiper
                      if (realIndex !== 0) {
                        formik.setFieldValue(
                          "senderNumber",
                          data[realIndex].cardNumber
                        )
                        return
                      }
                      formik.setValues(initialValues)
                    }}
                    value={formik.values.senderNumber}
                  >
                    {data.map((card) => (
                      <SwiperSlide key={card.cardNumber}>
                        <Cards
                          preview
                          cvc={card.cvv}
                          expiry={card.expirationDate}
                          name={`${card.cardBalance} ₴`}
                          number={card.cardNumber}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </center>
                <div className="TransactionTextReceiver">
                  <h3>To Card</h3>
                  <h4>
                    Please select the card or write a card number to which you
                    want to send money
                  </h4>
                </div>
                <center>
                  <Swiper
                    effect="coverflow"
                    grabCursor
                    centeredSlides
                    slidesPerView={2}
                    activeSlideKey="2"
                    coverflowEffect={{
                      rotate: 50,
                      stretch: 0,
                      depth: 100,
                      modifier: 1,
                      slideShadows: false,
                    }}
                    pagination={{
                      clickable: true,
                    }}
                    spaceBetween={-240}
                    onSlideChange={(swiper) => {
                      const { realIndex } = swiper
                      setSelected(realIndex)
                      if (realIndex !== 0) {
                        formik.setFieldValue(
                          "receiverNumber",
                          data[realIndex - 1].cardNumber
                        )
                        return
                      }
                      formik.setValues(initialValues)
                    }}
                    value={formik.values.receiverNumber}
                  >
                    <SwiperSlide>
                      <div className={classes.swiperSlide}>
                        <TextField
                          type="number"
                          value={
                            selected === 0 ? formik.values.receiverNumber : 0
                          }
                          label={
                            <div className={classes.commentSpan}>
                              <span>Number of receiver card</span>
                            </div>
                          }
                          error={
                            formik.touched.receiverNumber &&
                            Boolean(formik.errors.receiverNumber)
                          }
                          helperText={
                            formik.touched.receiverNumber &&
                            formik.errors.receiverNumber
                          }
                          name="receiverNumber"
                          onChange={formik.handleChange}
                          className={classes.input}
                        />
                      </div>
                    </SwiperSlide>
                    {data.map((card) => (
                      <SwiperSlide key={card.cardNumber}>
                        <Cards
                          cvc={card.cvv}
                          expiry={card.expirationDate}
                          name={`${card.cardBalance} ₴`}
                          number={card.cardNumber}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </center>
              </div>
            </div>
            <div className="TransactionInfo">
              <TextField
                id="remittance"
                name="remittance"
                label={
                  <div className={classes.commentSpan}>
                    <span>Sum</span>
                  </div>
                }
                type="number"
                value={formik.values.remittance}
                onChange={formik.handleChange}
                margin="normal"
                error={
                  formik.touched.remittance && Boolean(formik.errors.remittance)
                }
                helperText={
                  formik.touched.remittance && formik.errors.remittance
                }
                className={classes.transactionSum}
              />
              <TextField
                id="Comment"
                name="transactionComment"
                className={classes.comment}
                label={
                  <div className={classes.commentSpan}>
                    <span>Transaction Comment</span>
                  </div>
                }
                value={formik.values.transactionComment}
                onChange={formik.handleChange}
                margin="normal"
                error={
                  formik.touched.transactionComment &&
                  Boolean(formik.errors.transactionComment)
                }
                helperText={
                  formik.touched.transactionComment &&
                  formik.errors.transactionComment
                }
              />
              <FormControl component="div" className={classes.radioButton}>
                <FormLabel
                  component="legend"
                  className={classes.radioButtonLabelTitle}
                >
                  Type of paid services
                </FormLabel>
                <RadioGroup
                  aria-label="gender"
                  name="gender1"
                  value={value}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="Transfer funds"
                    control={<Radio color="primary" />}
                    label="Transfer funds"
                  />
                  <FormControlLabel
                    value="Utilities"
                    control={<Radio color="primary" />}
                    label="Utilities"
                  />
                  <FormControlLabel
                    value="Subscription"
                    control={<Radio color="primary" />}
                    label="Subscription"
                  />
                </RadioGroup>
              </FormControl>
              <br />
              {isLoadingTransaction ? (
                <Button
                  type="submit"
                  variant="outlined"
                  disabled={isLoadingTransaction}
                  className={classes.buttonLoading}
                >
                  <CircularProgress />
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="outlined"
                  disabled={isLoadingTransaction}
                  className={classes.submitButton}
                >
                  Submit
                </Button>
              )}
            </div>
          </div>
        </form>
      ) : (
        <h1 className={classes.emptyText}>You don&apos;t have any cards yet</h1>
      )}
      <ToastContainer />
    </Box>
  )
}
export default Transaction
