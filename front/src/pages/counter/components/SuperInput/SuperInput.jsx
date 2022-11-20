import classNames from "classnames"
import React from "react"
import styles from "./SuperInput.module.css"

const SuperInput = ({ value, onChange, count }) => {
  const classes = classNames({
    [styles.textbox]: true,
    [styles.borderColor]: count % 2 === 0,
  })
  return (
    <input
      className={classes}
      aria-label="Set increment amount"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}
export default SuperInput
