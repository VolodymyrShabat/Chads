import React from "react"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import { makeStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import "./css/BankAccount.css"
import Button from "@material-ui/core/Button"
import Image from "./bankCard.jpg"

const useStyles = makeStyles({
  cardContainer: {
    backgroundImage: `url(${Image})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    width: "100%",
    height: "100%",
    maxWidth: "60ch",
    paddingBottom: "0px",
    "&:hover": {
      opacity: 0.6,
    },
  },
  cardContainerUnselected: {
    width: "100%",
    height: "100%",
    maxWidth: "60ch",
    paddingBottom: "0px",
    color: "#A2A8B4",
    "&:hover": {
      opacity: 0.6,
      color: "blue",
    },
  },
  title: {
    textAlign: "left",
    fontSize: 14,
    color: "white",
  },
  titleUnselected: {
    textAlign: "left",
    fontSize: 14,
    color: "#626f7a",
  },
  button: {
    textAlign: "right",
    backgroundColor: "white",
    marginLeft: "70px",
    fontSize: "10px",
    "&:hover": {
      color: "white",
      border: "1px solid",
    },
  },
  buttonUnselected: {
    textAlign: "right",
    backgroundColor: "#2332AC",
    marginLeft: "70px",
    color: "white",
    fontSize: "10px",
    "&:hover": {
      color: "#6495ed",
      border: "1px solid",
    },
  },
})

function BankAccount({
  id,
  amount,
  setOpenId,
  openId,
  setSelected,
  selected,
  cardNumber,
}) {
  const classes = useStyles()
  const ShowModalMenu = () => {
    if (openId !== id) {
      setOpenId(id)
    } else {
      setOpenId(0)
    }
  }

  return (
    <Card
      className={
        selected === id
          ? classes.cardContainer
          : classes.cardContainerUnselected
      }
      onClick={() => {
        setSelected(id)
      }}
    >
      <CardContent>
        <Typography
          className={selected === id ? classes.title : classes.titleUnselected}
          gutterBottom
        >
          Bank account number: {id}
        </Typography>
        <h4
          className={
            selected === id ? "titleBankAccount" : "titleBankAccountUnselected"
          }
        >
          Personal Account Balance
        </h4>
        <h1
          className={
            selected === id
              ? "AmountBankAccount"
              : "AmountBankAccountUnselected"
          }
        >
          {amount} ₴
        </h1>
        <div className="buttonBankAccount">
          <h4
            className={
              selected === id ? "cardBankAccount" : "cardBankAccountUnselected"
            }
          >
            Card: {cardNumber === 0 ? "No card" : cardNumber}
          </h4>
          <Button
            className={
              selected === id ? classes.button : classes.buttonUnselected
            }
            color="primary"
            variant="outlined"
            onClick={ShowModalMenu}
          >
            Edit limit
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default BankAccount
