import React from "react"
import ListItem from "@material-ui/core/ListItem"
import Divider from "@material-ui/core/Divider"
import { createTheme, ThemeProvider } from "@material-ui/core/styles"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import PaymentIcon from "@material-ui/icons/Payment"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import "./css/TransactionHistory.css"
import { v1 as uuid } from "uuid"

const theme = createTheme({
  overrides: {
    MuiListItemIcon: {
      root: {
        color: "inherit",
      },
    },
  },
})

function TransactionHistory({ transaction, useraccountId }) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const secondaryInfo = (message, IsSender) => {
    switch (message.split(" ")[0]) {
      case "Opening":
        return IsSender
          ? "Withdrawal of funds on deposit"
          : "Getting money from deposit"

      case "Closing":
        return IsSender
          ? "Withdrawal of funds on deposit"
          : "Accrual of funds from deposit"
      case "Sending":
        return IsSender
          ? `Transfer money to card: ${message.split(" ")[6]}`
          : `Receiving money from card: ${message.split(" ")[4]}`
      default:
        return IsSender ? `Transfer of funds` : `Receiving of funds`
    }
  }

  const getDateInFormat = (date) =>
    `${`${days[date.getDay()]}, ${date.getDate()}`} of ${
      months[date.getMonth()]
    } ${date.getFullYear()}`

  return (
    <div className="HistoryTransactionContainer">
      <>
        <ListItem className="transaction" key={uuid()}>
          <ThemeProvider theme={theme}>
            <ListItemIcon>
              <PaymentIcon style={{ color: "#4169E1" }} />
            </ListItemIcon>
          </ThemeProvider>

          <ListItemText
            primary={`${
              transaction.Message.trim() === "" ||
              transaction.Message[0] === "S"
                ? "Transfer of funds"
                : transaction.Message
            } ${getDateInFormat(new Date(transaction.DateOfTransaction))}`}
            secondary={
              <div>
                <div>
                  {transaction.Message !== " "
                    ? secondaryInfo(
                        transaction.Message.replace(/(\r\n|\n|\r)/gm, ""),
                        transaction.SenderId === useraccountId
                      )
                    : ""}
                </div>
                <div>
                  {transaction.Comment.trim().length === 0
                    ? ""
                    : `Comment: ${transaction.Comment}`}
                </div>
              </div>
            }
          />
          <ListItemSecondaryAction>
            <h3
              className="incomingHistory"
              style={
                transaction.SenderId === useraccountId
                  ? { color: "#B92E34" }
                  : { color: "#00693E" }
              }
            >
              {transaction.SenderId === useraccountId
                ? `-${transaction.Remittance} ₴`
                : `${transaction.Remittance} ₴`}
            </h3>
            <h5 className="resultHistory">
              {transaction.MoneyAfterTransaction} ₴
            </h5>
          </ListItemSecondaryAction>
        </ListItem>
      </>
      <Divider variant="inset" component="li" />
    </div>
  )
}
export default TransactionHistory
