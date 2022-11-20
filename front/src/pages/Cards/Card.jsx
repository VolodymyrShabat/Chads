import React from "react"
import Cards from "react-credit-cards"

export default function Card({
  cvc,
  expiry,
  focused,
  cardBalance,
  number,
  onClick,
}) {
  return (
    <div onClick={onClick}>
      <Cards
        cvc={cvc}
        expiry={expiry}
        focused={focused}
        name={`${cardBalance} ₴`}
        number={number}
      />
    </div>
  )
}
