import React, { useState } from "react"
import Button from "@material-ui/core/Button"
import Login from "./Login"
import SignUp from "./SignUp"
import LoginBanner from "./loginBanner"
import SignUpBanner from "./signUpBanner"
import "./css/auth.css"

const Container = () => {
  const [changeForm, setChangeForm] = useState(false)

  const setBannerClass = () => {
    const classArr = ["banner-side"]
    if (changeForm) classArr.push("send-right")
    return classArr.join(" ")
  }

  const setFormClass = () => {
    const classArr = ["form-side"]
    if (changeForm) classArr.push("send-left")
    return classArr.join(" ")
  }
  return (
    <div className="appLogin">
      <div className="cfb">
        <div className="container">
          <div className={setBannerClass()}>
            {changeForm ? <SignUpBanner /> : <LoginBanner />}

            <Button
              style={{ marginTop: "10px", color: "white" }}
              type="button"
              variant="outlined"
              color="default"
              onClick={() => setChangeForm(!changeForm)}
            >
              {changeForm ? "Login In" : "Sign Up"}
            </Button>
          </div>
          <div className={setFormClass()}>
            {changeForm ? <SignUp /> : <Login />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Container
