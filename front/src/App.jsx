import React from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom"
import DrawerMenu from "./pages/DrawerMenu/DrawerMenu"
import DepositTabs from "./pages/deposits/depositsMain"

import Auth from "./pages/auth/Container"
import CardsMain from "./pages/Cards/CardsMain"
import CreateCard from "./pages/Cards/CreateCard"
import CardDetails from "./pages/Cards/CardDetails"
import PhoneConfirm from "./pages/auth/PhoneConfirm"
import Test from "./pages/auth/testJWT"
import "./App.css"
import Transaction from "./pages/Transactions/Transaction"
import UserBankAccounts from "./pages/BankAccount/UserBankAccounts"
import Success from "./pages/BankAccount/Success"
import PrivateRoute from "./app/PrivateRoute"

import ConfirmTransactionForm from "./pages/Transactions/ConfirmTransactionForm"

function App() {
  return (
    <div className="App">
      <Router>
        <DrawerMenu />
        {!localStorage.getItem("access_token") && <Redirect to="/login" />}
        <Switch>
          <Route path="/test-jwt">
            <Test />
          </Route>
          <Route path="/testQR">
            <PhoneConfirm />
          </Route>
          <Route path="/login">
            <Auth />
          </Route>

          <PrivateRoute path="/success">
            <Success />
          </PrivateRoute>
          <PrivateRoute path="/cards">
            <CardsMain />
          </PrivateRoute>
          <PrivateRoute path="/transactions">
            <Transaction />
          </PrivateRoute>
          <PrivateRoute path="/bankaccounts">
            <UserBankAccounts />
          </PrivateRoute>
          <PrivateRoute path="/confirmTransaction">
            <ConfirmTransactionForm />
          </PrivateRoute>
          <Redirect exact from="/deposits" to="/deposits/my" />
          <PrivateRoute
            exact
            path="/deposits/:page?"
            // eslint-disable-next-line react/jsx-props-no-spreading
            component={(props) => <DepositTabs {...props} />}
          />

          <PrivateRoute path="/createCard">
            <CreateCard />
          </PrivateRoute>
          <Route
            exact
            path="/carddetails"
            // eslint-disable-next-line react/jsx-props-no-spreading
            component={(props) => <CardDetails {...props} />}
          />
          <PrivateRoute exact path="/">
            <CardsMain />
          </PrivateRoute>
        </Switch>
      </Router>
    </div>
  )
}

export default App
