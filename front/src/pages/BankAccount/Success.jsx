import CheckCircleIcon from "@material-ui/icons/CheckCircle"
import React from "react"
import { Link } from "react-router-dom"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles({
  titleSuccess: {
    padding: "5",
    fontSize: "35px",
    fontFamily: `"Roboto Condensed", sans-serif`,
  },
  iconSuccess: {
    color: "#54C7C3",
    width: "10%",
    height: "10%",
    margin: "60px 0 0 0",
  },
  buttonSuccess: {
    backgroundColor: "#3F51B5",
    padding: "9px 18px",
    fontSize: "15px",
    color: "white",
    margin: "0 auto",
    width: "180px",
    textDecoration: "none",
    "&:hover": {
      color: "#3F51B5",
      border: "1px solid",
      backgroundColor: "white",
    },
  },
})

function Success() {
  const classes = useStyles()
  return (
    <div>
      <CheckCircleIcon className={classes.iconSuccess} />
      <h1 className={classes.titleSuccess}>
        Your transaction has been successfully confirmed!
      </h1>
      <Link to="/transactions" className={classes.buttonSuccess}>
        Return to transaction page
      </Link>
    </div>
  )
}
export default Success
