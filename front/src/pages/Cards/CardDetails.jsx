import React from "react"
import Card from "./Card"
import "./css/CardDetails.css"
import { useLocation, useHistory } from "react-router-dom"
import Button from "@material-ui/core/Button"
import { ToastContainer, toast } from "react-toastify"
import { useBlockCardMutation, useDeleteCardMutation } from "./cardsApiSlice"

export default function CardDetails() {
  const location = useLocation()
  const [blockCard, { isLoading }] = useBlockCardMutation()
  const [deleteCard, { isDeleteLoading }] = useDeleteCardMutation()
  const history = useHistory()

  function date(date) {
    let year = date.getUTCFullYear()
    let month = date.getUTCMonth() + 1
    return "0" + month + "/" + year
  }

  let copyCard = () => {
    navigator.clipboard.writeText(location.state.cardNumber).then(
      function () {
        toast.success("Copying to clipboard was successful!", {
          position: "bottom-right",
        })
      },
      function (err) {
        toast.error(err, {
          position: "bottom-right",
        })
      }
    )
  }

  let watchHistory = () => {
    history.push("/bankaccounts")
  }

  async function block() {
    try {
      await blockCard(location.state.cardNumber).unwrap()
      toast.success("🚀 Card blocked!", {
        position: "bottom-right",
      })
    } catch {
      toast.error("Error! Try again later.", {
        position: "bottom-right",
      })
    }
  }

  async function deleteC() {
    try {
      await deleteCard(location.state.cardNumber).unwrap()
      toast.success("🚀 Card deleted!", {
        position: "bottom-right",
      })
      history.push("/cards")
    } catch {
      toast.error("Error! Try again later.", {
        position: "bottom-right",
      })
    }
  }

  return (
    <div className="main_content">
      <h1>Your Card</h1>
      <Card
        cvc={location.state.cvc}
        expiry={date(new Date(location.state.expirationDate))}
        focused={""}
        cardBalance={location.state.cardBalance}
        number={location.state.cardNumber}
      />
      {location.state.isBlocked ? (
        <h2>Your card is blocked</h2>
      ) : (
        <h2>Your card is active</h2>
      )}
      <div className="btns">
        <div className="button_content">
          <div className="title_content">
            <Button onClick={copyCard} variant="contained" color="primary">
              Copy to clipboard
            </Button>
            <p>Copy your card requisites to clipbord, for faster sharing</p>
          </div>
          <div className="title_content">
            <Button onClick={watchHistory} variant="contained" color="primary">
              Watch History
            </Button>
            <p>Watch your account transitions History</p>
          </div>
        </div>
        <div className="button_content">
          {location.state.isBlocked ? (
            ""
          ) : (
            <div className="title_content">
              <Button onClick={block} variant="contained" color="primary">
                Block Card
              </Button>
              <p>You can block your Card if you lost it or dont want to use</p>
            </div>
          )}
          <div className="title_content">
            <Button onClick={deleteC} variant="contained" color="primary">
              Delete Card
            </Button>
            <p> You can Delete your Card, if you plan not use it anymore</p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}
