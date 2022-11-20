import React from "react"
import { useState, useRef, useEffect } from "react"
import "./css/CreateCard.css"
import Card from "./Card"
import { useDispatch, useSelector } from "react-redux"
import RadioGroup from "@material-ui/core/RadioGroup"
import FormControl from "@material-ui/core/FormControl"
import FormLabel from "@material-ui/core/FormLabel"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Radio from "@material-ui/core/Radio"
import { render } from "@testing-library/react"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import { useAddCardMutation } from "./cardsApiSlice"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.min.css"
import { useHistory } from "react-router-dom"
import { useFetchCardTypesQuery } from "./cardsApiSlice"

export default function CreateCard() {
  var cardno = /^(?:3[47][0-9]{13})$/
  var cardVisano = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/
  var cardMasterno = /^(?:5[1-5][0-9]{14})$/
  const history = useHistory()
  const value = useSelector((state) => state.value)
  const [number, setNumber] = useState("")
  const [cvv, setCvv] = useState("")
  const [focus, setFocus] = useState("")
  const [type, setType] = useState("")
  const { data = [], isTypesLoading } = useFetchCardTypesQuery()
  const [errorMessage, setErrorMessage] = useState("")

  const [addCard, { isLoading }] = useAddCardMutation()

  let handlePaymentSystemChange = (event, value) => {
    setType(value)
    if (value == "visa") {
      setNumber("4")
    } else if (value == "mastercard") {
      setNumber("51")
    } else {
      setNumber("")
    }
  }

  let handleNumberTextField = (event) => {
    setNumber(event.target.value)
    validateCreditCard(event.target.value)
  }

  const validateCreditCard = (value) => {
    if (value.charAt(0) == "3") {
      setType("visa")
      if (value.match(cardno)) {
        setErrorMessage("Valid CreditCard Number")
      } else {
        setErrorMessage("Enter valid CreditCard Number!")
      }
    } else if (value.charAt(0) == "4") {
      setType("visa")
      if (value.match(cardVisano)) {
        setErrorMessage("Valid CreditCard Number")
      } else {
        setErrorMessage("Enter valid CreditCard Number!")
      }
    } else {
      setType("mastercard")
      if (value.match(cardMasterno)) {
        setErrorMessage("Valid CreditCard Number")
      } else {
        setErrorMessage("Enter valid CreditCard Number!")
      }
    }
  }

  let handleTextFieldClick = () => {
    setFocus("number")
    if (number == "4" || number == "51") {
    }
  }

  let handleCvvTextField = (event) => {
    setCvv(event.target.value)
  }
  let handleCvvClick = (event) => {
    setFocus("cvc")
  }

  let expirationDate = () => {
    const lastDate = 1576800
    let date = new Date()
    date.setMinutes(lastDate)
    let year = date.getUTCFullYear()
    let month = date.getUTCMonth() + 1
    return "0" + month + "/" + year
  }

  async function submit() {
    let myJSON = {
      card_number: Number(number),
      cvv: Number(cvv),
      type: type,
      currency: "usd",
      card_name_id: 0,
    }

    if (number.length == 16 && cvv.length == 3 && type != "") {
      try {
        await addCard(JSON.stringify(myJSON)).unwrap()
        toast.success("🚀 Card created !", {
          position: "bottom-right",
        })
        history.push("/cards")
      } catch {
        toast.error("Error! Try again later. ", {
          position: "bottom-right",
        })
      }
    } else {
      toast.error("You have to fill all fields", {
        position: "bottom-right",
      })
    }
  }

  return (
    <div className="margin">
      <div>
        <h1>Create Card</h1>
      </div>
      {isTypesLoading && <CircularProgress size={25} />}
      <div className="create_content">
        <div className="card_form">
          <Card
            cvc={cvv}
            expiry={expirationDate()}
            focused={focus}
            name={""}
            number={number}
            onClick={""}
          />
        </div>
        <div className="form_block">
          <div className="pay_system">
            <FormControl component="fieldset">
              <FormLabel component="legend">
                <span className="form_name">Payment System</span>
              </FormLabel>
              <RadioGroup value={value} onChange={handlePaymentSystemChange}>
                <FormControlLabel
                  value="visa"
                  control={<Radio />}
                  label="Visa"
                />
                <FormControlLabel
                  value="mastercard"
                  control={<Radio />}
                  label="Mastercard"
                />
              </RadioGroup>
            </FormControl>
          </div>
          <div className="cardNumber_form">
            <form noValidate autoComplete="off">
              <TextField
                id="standard-basic"
                label="Card number"
                onClick={handleTextFieldClick}
                onChange={handleNumberTextField}
                value={number}
                helperText={errorMessage}
              />
            </form>
          </div>
          <div className="cvv_form">
            <form noValidate autoComplete="off">
              <TextField
                id="standard-basic"
                label="CVV"
                onChange={handleCvvTextField}
                onClick={handleCvvClick}
              />
            </form>
          </div>
          <div className="card_type">
            <FormControl component="fieldset">
              <FormLabel component="legend">
                <span className="form_name">Card Type</span>
              </FormLabel>
              <RadioGroup value={value}>
                {data.map((type) => (
                  <FormControlLabel
                    value={type.Id.toString()}
                    control={<Radio />}
                    label={type.CardName.toString().capitalize()}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </div>
          <div className="card_type">
            <Button onClick={submit} variant="contained" color="primary">
              Create card
            </Button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1)
}
