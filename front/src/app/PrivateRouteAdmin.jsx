/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from "react"
import { Route } from "react-router-dom"
import jwtDecode from "jwt-decode"
import Error from "../pages/Error/Error"

function PrivateRouteAdmin({ component: Component, ...rest }) {
  let token = localStorage.getItem("access_token")
  let decoded = token && jwtDecode(token)

  useEffect(() => {
    token = localStorage.getItem("access_token")
    decoded = token && jwtDecode(token)
  })

  return (
    <Route
      {...rest}
      render={(props) =>
        decoded?.role === "Admin" ? (
          <Component {...props} />
        ) : (
          <Error err="error" />
        )
      }
    />
  )
}
export default PrivateRouteAdmin
