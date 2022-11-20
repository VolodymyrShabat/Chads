import React from "react"
import { Box, makeStyles } from "@material-ui/core"
import styled from "styled-components"
import img from "./error.png"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(0),
    },
  },
}))

export const ImgError = styled.img`
  width: 50%;
`

function CustomErrorOverlay() {
  const classes = useStyles()

  return (
    <>
      <Box className={classes.root}>
        <ImgError src={img} alt="error" />
      </Box>
    </>
  )
}

export default CustomErrorOverlay
