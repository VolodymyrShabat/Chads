import React from "react"
import "./css/CardsMain.css"
import Card from "./Card"
import "react-credit-cards/es/styles-compiled.css"
import { CircularProgress } from "@material-ui/core"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { useFetchCardsQuery } from "./cardsApiSlice"
import { useHistory } from "react-router-dom"

const CardsMain = () => {
  const history = useHistory()
  const { data = [], isLoading } = useFetchCardsQuery()

  let createCard = () => {
    history.push("/createCard")
  }

  function date(date) {
    let year = date.getUTCFullYear()
    let month = date.getUTCMonth() + 1
    return "0" + month + "/" + year
  }

  return (
    <div className="a">
      <div className="main_content">
        <h1>Your Cards</h1>

        <div className="main_content-slider">
          {isLoading && <CircularProgress size={25} />}
          <Slider
            dots={true}
            infinite={false}
            speed={500}
            slidesToShow={
              data.lenght == 2
                ? 2
                : data.lenght == 0 || data.lenght == 1
                ? 1
                : 3
            }
            slidesToScroll={1}
            className={"slider"}
          >
            {[...new Set(data)].map((card) => (
              <Card
                cvc={card.cvv}
                expiry={date(new Date(card.expirationDate))}
                focused={""}
                cardBalance={card.cardBalance}
                number={card.cardNumber}
                onClick={() => {
                  history.push({
                    pathname: "/carddetails",
                    state: card,
                  })
                }}
              />
            ))}
            {!isLoading && (
              <Card
                cvc={"222"}
                expiry={""}
                focused={""}
                name={"ADD NEW CARD"}
                number={""}
                onClick={createCard}
              />
            )}
          </Slider>
        </div>
      </div>
    </div>
  )
}

function SampleNextArrow(props) {
  const { className, style, onClick } = props
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "darkblue" }}
      onClick={onClick}
    />
  )
}

function SamplePrevArrow(props) {
  const { prev, style, onClick } = props
  return (
    <div
      className="prev"
      style={{ ...style, display: "block", background: "darkblue" }}
      onClick={onClick}
    />
  )
}

export default CardsMain
