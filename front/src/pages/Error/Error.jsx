import React from "react"
import styles from "./Error.module.css"

function Error({ err }) {
  return (
    <div className={styles.container}>
      <div className={styles.text}>{err}</div>
    </div>
  )
}

export default Error
